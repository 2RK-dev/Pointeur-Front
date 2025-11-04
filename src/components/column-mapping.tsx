"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { TableSchema } from "@/lib/mock-tables"
import type { FileTableAssociation } from "./file-table-mapping"
import type { FileType } from "./file-upload"
import { parseCSV, parseExcel, parseJSON, extractJSONData, detectBestMapping } from "@/lib/file-parser"
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"

export interface ColumnMapping {
  fileHeader: string
  tableColumn: string
  isRequired: boolean
}

export interface TableMapping {
  tableName: string
  source: FileTableAssociation
  columnMappings: ColumnMapping[]
}

interface ColumnMappingInterfaceProps {
  files: File[]
  fileType: FileType
  associations: FileTableAssociation[]
  tables: TableSchema[]
  mappings: TableMapping[]
  onMappingsChange: (mappings: TableMapping[]) => void
}

export function ColumnMappingInterface({
  files,
  fileType,
  associations,
  tables,
  mappings,
  onMappingsChange,
}: ColumnMappingInterfaceProps) {
  const [fileHeaders, setFileHeaders] = useState<Map<string, string[]>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHeaders = async () => {
      setLoading(true)
      const headersMap = new Map<string, string[]>()

      for (const association of associations) {
        const file = files[association.fileIndex]
        const key = `${association.fileIndex}-${association.sheetName || ""}-${association.jsonPath || ""}`

        try {
          if (fileType === "csv") {
            const data = await parseCSV(file)
            headersMap.set(key, data.headers)
          } else if (fileType === "excel" && association.sheetName) {
            const sheetsData = await parseExcel(file)
            const sheetData = sheetsData.get(association.sheetName)
            if (sheetData) {
              headersMap.set(key, sheetData.headers)
            }
          } else if (fileType === "json") {
            const jsonData = await parseJSON(file)
            const data = extractJSONData(jsonData, association.jsonPath)
            headersMap.set(key, data.headers)
          }
        } catch (error) {
          console.error("[v0] Error loading headers:", error)
        }
      }

      setFileHeaders(headersMap)

      // Auto-generate mappings
      const newMappings: TableMapping[] = associations.map((association) => {
        const key = `${association.fileIndex}-${association.sheetName || ""}-${association.jsonPath || ""}`
        const headers = headersMap.get(key) || []
        const table = tables.find((t) => t.name === association.tableName)

        if (!table) {
          return {
            tableName: association.tableName,
            source: association,
            columnMappings: [],
          }
        }

        const existingMapping = mappings.find(
          (m) =>
            m.source.fileIndex === association.fileIndex &&
            m.source.sheetName === association.sheetName &&
            m.source.jsonPath === association.jsonPath,
        )

        if (existingMapping) {
          return existingMapping
        }

        const autoMapping = detectBestMapping(
          headers,
          table.columns.map((c) => c.name),
        )

        const columnMappings: ColumnMapping[] = headers.map((header) => ({
          fileHeader: header,
          tableColumn: autoMapping.get(header) || "",
          isRequired: false,
        }))

        return {
          tableName: association.tableName,
          source: association,
          columnMappings,
        }
      })

      onMappingsChange(newMappings)
      setLoading(false)
    }

    if (associations.length > 0) {
      loadHeaders()
    }
  }, [associations, files, fileType])

  const updateMapping = (mappingIndex: number, fileHeader: string, tableColumn: string) => {
    const newMappings = [...mappings]
    const columnMappingIndex = newMappings[mappingIndex].columnMappings.findIndex((cm) => cm.fileHeader === fileHeader)

    if (columnMappingIndex >= 0) {
      newMappings[mappingIndex].columnMappings[columnMappingIndex].tableColumn = tableColumn
    }

    onMappingsChange(newMappings)
  }

  const getMappingStatus = (mapping: TableMapping) => {
    const table = tables.find((t) => t.name === mapping.tableName)
    if (!table) return { complete: false, requiredMissing: 0 }

    const requiredColumns = table.columns.filter((c) => c.required)
    const mappedRequired = requiredColumns.filter((rc) =>
      mapping.columnMappings.some((cm) => cm.tableColumn === rc.name),
    )

    return {
      complete: mappedRequired.length === requiredColumns.length,
      requiredMissing: requiredColumns.length - mappedRequired.length,
      totalMapped: mapping.columnMappings.filter((cm) => cm.tableColumn).length,
      totalColumns: mapping.columnMappings.length,
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Analyse des fichiers en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Mapping des colonnes</h3>
        <p className="text-sm text-muted-foreground">
          Associez les colonnes de vos fichiers aux champs des tables. Les mappings suggérés sont détectés
          automatiquement.
        </p>
      </div>

      {mappings.map((mapping, mappingIndex) => {
        const table = tables.find((t) => t.name === mapping.tableName)
        const status = getMappingStatus(mapping)

        if (!table) return null

        return (
          <Card key={mappingIndex} className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">{table.displayName}</h4>
                {status.complete ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Complet
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-orange-500/20 text-orange-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {status.requiredMissing} champs requis manquants
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Source: {mapping.source.fileName}
                {mapping.source.sheetName && ` → ${mapping.source.sheetName}`}
                {mapping.source.jsonPath && ` → ${mapping.source.jsonPath}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {status.totalMapped} / {status.totalColumns} colonnes mappées
              </p>
            </div>

            <div className="space-y-3">
              {mapping.columnMappings.map((columnMapping, colIndex) => {
                const tableColumn = table.columns.find((c) => c.name === columnMapping.tableColumn)
                const isRequired = tableColumn?.required || false

                return (
                  <div key={colIndex} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">{columnMapping.fileHeader}</Label>
                      <p className="text-xs text-muted-foreground">Colonne du fichier</p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                    <div className="flex-1">
                      <Select
                        value={columnMapping.tableColumn || "ignore"}
                        onValueChange={(value) => updateMapping(mappingIndex, columnMapping.fileHeader, value)}
                      >
                        <SelectTrigger className={isRequired && !columnMapping.tableColumn ? "border-orange-500" : ""}>
                          <SelectValue placeholder="Ignorer cette colonne" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ignore">
                            <span className="text-muted-foreground">Ignorer</span>
                          </SelectItem>
                          {table.columns.map((col) => (
                            <SelectItem key={col.name} value={col.name}>
                              <div className="flex items-center gap-2">
                                <span>{col.name}</span>
                                {col.required && (
                                  <Badge variant="outline" className="text-xs border-orange-500/20 text-orange-600">
                                    requis
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">({col.type})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
