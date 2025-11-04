"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FileType } from "./file-upload"
import type { TableSchema } from "@/lib/mock-tables"
import { parseExcel, parseJSON } from "@/lib/file-parser"
import { File, FileSpreadsheet, FileJson, ArrowRight, Table2 } from "lucide-react"
import { Input } from "@/components/ui/input"

export interface FileTableAssociation {
  fileIndex: number
  fileName: string
  sheetName?: string
  jsonPath?: string
  tableName: string
}

interface FileTableMappingProps {
  files: File[]
  fileType: FileType
  selectedTables: string[]
  tables: TableSchema[]
  associations: FileTableAssociation[]
  onAssociationsChange: (associations: FileTableAssociation[]) => void
}

export function FileTableMapping({
  files,
  fileType,
  selectedTables,
  tables,
  associations,
  onAssociationsChange,
}: FileTableMappingProps) {
  const [excelSheets, setExcelSheets] = useState<Map<number, string[]>>(new Map())
  const [jsonStructures, setJsonStructures] = useState<Map<number, string[]>>(new Map())

  useEffect(() => {
    const loadFileStructures = async () => {
      if (fileType === "excel") {
        const sheetsMap = new Map<number, string[]>()
        for (let i = 0; i < files.length; i++) {
          const sheetsData = await parseExcel(files[i])
          sheetsMap.set(i, Array.from(sheetsData.keys()))
        }
        setExcelSheets(sheetsMap)
      } else if (fileType === "json") {
        const structuresMap = new Map<number, string[]>()
        for (let i = 0; i < files.length; i++) {
          try {
            const jsonData = await parseJSON(files[i])
            const keys = Object.keys(jsonData).filter((key) => Array.isArray(jsonData[key]))
            structuresMap.set(i, keys)
          } catch (error) {
            structuresMap.set(i, [])
          }
        }
        setJsonStructures(structuresMap)
      }
    }

    loadFileStructures()
  }, [files, fileType])

  const getFileIcon = () => {
    switch (fileType) {
      case "csv":
        return <File className="h-5 w-5 text-primary" />
      case "excel":
        return <FileSpreadsheet className="h-5 w-5 text-primary" />
      case "json":
        return <FileJson className="h-5 w-5 text-primary" />
    }
  }

  const updateAssociation = (fileIndex: number, field: keyof FileTableAssociation, value: string) => {
    const newAssociations = [...associations]
    const existingIndex = newAssociations.findIndex((a) => a.fileIndex === fileIndex)

    if (existingIndex >= 0) {
      newAssociations[existingIndex] = {
        ...newAssociations[existingIndex],
        [field]: value,
      }
    } else {
      newAssociations.push({
        fileIndex,
        fileName: files[fileIndex].name,
        tableName: "",
        [field]: value,
      } as FileTableAssociation)
    }

    onAssociationsChange(newAssociations)
  }

  const getAssociation = (fileIndex: number) => {
    return associations.find((a) => a.fileIndex === fileIndex)
  }

  const renderCSVMapping = () => {
    return files.map((file, index) => {
      const association = getAssociation(index)
      return (
        <Card key={index} className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              {getFileIcon()}
              <span className="font-medium text-sm">{file.name}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <Select
                value={association?.tableName || ""}
                onValueChange={(value) => updateAssociation(index, "tableName", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une table" />
                </SelectTrigger>
                <SelectContent>
                  {tables
                    .filter((t) => selectedTables.includes(t.name))
                    .map((table) => (
                      <SelectItem key={table.name} value={table.name}>
                        <div className="flex items-center gap-2">
                          <Table2 className="h-4 w-4" />
                          {table.displayName}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )
    })
  }

  const renderExcelMapping = () => {
    return files.map((file, fileIndex) => {
      const sheets = excelSheets.get(fileIndex) || []
      return (
        <Card key={fileIndex} className="p-4 space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            {getFileIcon()}
            <span>{file.name}</span>
          </div>
          <div className="space-y-2 pl-7">
            {sheets.map((sheetName) => {
              const association = associations.find((a) => a.fileIndex === fileIndex && a.sheetName === sheetName)
              return (
                <div key={sheetName} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm text-muted-foreground">Feuille:</span>
                    <span className="font-medium text-sm">{sheetName}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <Select
                      value={association?.tableName || ""}
                      onValueChange={(value) => {
                        const newAssociations = associations.filter(
                          (a) => !(a.fileIndex === fileIndex && a.sheetName === sheetName),
                        )
                        newAssociations.push({
                          fileIndex,
                          fileName: file.name,
                          sheetName,
                          tableName: value,
                        })
                        onAssociationsChange(newAssociations)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une table" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables
                          .filter((t) => selectedTables.includes(t.name))
                          .map((table) => (
                            <SelectItem key={table.name} value={table.name}>
                              <div className="flex items-center gap-2">
                                <Table2 className="h-4 w-4" />
                                {table.displayName}
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
    })
  }

  const renderJSONMapping = () => {
    return files.map((file, fileIndex) => {
      const keys = jsonStructures.get(fileIndex) || []
      const association = getAssociation(fileIndex)

      return (
        <Card key={fileIndex} className="p-4 space-y-4">
          <div className="flex items-center gap-2 font-semibold">
            {getFileIcon()}
            <span>{file.name}</span>
          </div>

          <div className="space-y-3 pl-7">
            <div>
              <Label className="text-sm mb-2 block">Structure du JSON</Label>
              <RadioGroup
                value={association?.jsonPath || "root"}
                onValueChange={(value) => {
                  updateAssociation(fileIndex, "jsonPath", value === "root" ? "" : value)
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`root-${fileIndex}`}
                      value="root"
                      checked={!association?.jsonPath}
                      onChange={() => updateAssociation(fileIndex, "jsonPath", "")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`root-${fileIndex}`} className="cursor-pointer">
                      Fichier JSON complet (racine)
                    </Label>
                  </div>

                  {keys.length > 0 && (
                    <>
                      <div className="text-sm text-muted-foreground">Ou sélectionner un attribut:</div>
                      {keys.map((key) => (
                        <div key={key} className="flex items-center gap-2 pl-4">
                          <input
                            type="radio"
                            id={`${fileIndex}-${key}`}
                            value={key}
                            checked={association?.jsonPath === key}
                            onChange={() => updateAssociation(fileIndex, "jsonPath", key)}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={`${fileIndex}-${key}`} className="cursor-pointer">
                            {key}
                          </Label>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`custom-${fileIndex}`}
                      value="custom"
                      checked={association?.jsonPath !== "" && !keys.includes(association?.jsonPath || "")}
                      onChange={() => {}}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`custom-${fileIndex}`}>Chemin personnalisé:</Label>
                    <Input
                      placeholder="ex: data.users"
                      value={association?.jsonPath && !keys.includes(association.jsonPath) ? association.jsonPath : ""}
                      onChange={(e) => updateAssociation(fileIndex, "jsonPath", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm mb-2 block">Table de destination</Label>
              <Select
                value={association?.tableName || ""}
                onValueChange={(value) => updateAssociation(fileIndex, "tableName", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une table" />
                </SelectTrigger>
                <SelectContent>
                  {tables
                    .filter((t) => selectedTables.includes(t.name))
                    .map((table) => (
                      <SelectItem key={table.name} value={table.name}>
                        <div className="flex items-center gap-2">
                          <Table2 className="h-4 w-4" />
                          {table.displayName}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Association Fichiers → Tables</h3>
        <p className="text-sm text-muted-foreground">
          {fileType === "csv" && "Associez chaque fichier CSV à une table"}
          {fileType === "excel" && "Associez chaque feuille Excel à une table"}
          {fileType === "json" && "Définissez la structure JSON et la table de destination"}
        </p>
      </div>

      <div className="space-y-3">
        {fileType === "csv" && renderCSVMapping()}
        {fileType === "excel" && renderExcelMapping()}
        {fileType === "json" && renderJSONMapping()}
      </div>
    </div>
  )
}

function RadioGroup({
  value,
  onValueChange,
  children,
}: {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
