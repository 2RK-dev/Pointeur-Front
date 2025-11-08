"use client"

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Label} from "@/components/ui/label"
import {Badge} from "@/components/ui/badge"
import {Card} from "@/components/ui/card"
import {AlertCircle, ArrowRight, CheckCircle2, Sparkles} from "lucide-react"
import type {ColumnMapping, TableColumn} from "@/lib/types"

interface ColumnMapperProps {
    fileHeaders: string[]
    tableColumns: TableColumn[]
    mappings: ColumnMapping[]
    onMappingsChange: (mappings: ColumnMapping[]) => void
    previewData: any[]
}

export function ColumnMapper({
                                 fileHeaders,
                                 tableColumns,
                                 mappings,
                                 onMappingsChange,
                                 previewData,
                             }: ColumnMapperProps) {
    const handleMappingChange = (fileColumn: string, tableColumn: string) => {
        const newMappings = mappings.map((m) =>
            m.fileColumn === fileColumn
                ? {...m, tableColumn: tableColumn === "none" ? null : tableColumn, confidence: 0}
                : m,
        )
        onMappingsChange(newMappings)
    }

    const getMappedTableColumn = (fileColumn: string) => {
        return mappings
            .filter((m): m is ColumnMapping => !!m && typeof m === "object" && "fileColumn" in m)
            .find((m) => m.fileColumn === fileColumn)?.tableColumn || null
    }

    const getColumnType = (columnName: string | null) => {
        if (!columnName) return null
        return tableColumns.find((c) => c.name === columnName)?.type
    }


    const unmappedRequired = tableColumns.filter(
        (col) => !mappings.some((m) => m.tableColumn === col.name),
    )

    const getMappedColumns = () => {
        return mappings.filter((m) => {
            if (!m || typeof m !== "object") return false
            if (m.tableColumn === null || m.tableColumn === undefined) return false
            return !(m.fileColumn === undefined || m.fileColumn === null);

        })
    }

    const getConfidence = (fileColumn: string) => {
        return mappings
            .filter((m): m is ColumnMapping => !!m && typeof m === "object" && "fileColumn" in m)
            .find((m) => m.fileColumn === fileColumn)?.confidence || 0
    }

    return (
        <div className="space-y-3">
            {unmappedRequired.length > 0 && (
                <Card className="p-3 border-red-500 bg-red-50 dark:bg-red-950">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0"/>
                        <div className="flex-1">
                            <div className="font-medium text-sm text-red-800 dark:text-red-200">
                                {unmappedRequired.length} champ(s) requis non mappé(s)
                            </div>
                            <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                                Vous devez mapper ces champs avant de pouvoir importer:{" "}
                                <strong>{unmappedRequired.map((col) => col.name).join(", ")}</strong>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {unmappedRequired.length === 0 && mappings.some((m) => m.tableColumn) && (
                <Card className="p-3 border-green-500 bg-green-50 dark:bg-green-950">
                    <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5"/>
                        <div>
                            <div className="font-medium text-sm text-green-800 dark:text-green-200">
                                Tous les champs requis sont mappés
                            </div>
                            <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                                Ce mapping est prêt pour l'importation
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            <div className="space-y-2">
                {fileHeaders.map((fileHeader, index) => {
                    const mappedColumn = getMappedTableColumn(fileHeader)
                    const columnType = getColumnType(mappedColumn)
                    const required = true
                    const confidence = getConfidence(fileHeader)

                    return (
                        <Card key={index} className="p-3">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Colonne du fichier</Label>
                                    <div className="font-medium text-sm">{fileHeader}</div>
                                    {previewData.length > 0 && (
                                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                            Ex: {previewData[0][fileHeader]?.toString() || "—"}
                                        </div>
                                    )}
                                </div>

                                <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block"/>

                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">Colonne de la table</Label>
                                    <Select
                                        value={mappedColumn || "none"}
                                        onValueChange={(value) => handleMappingChange(fileHeader, value)}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Ne pas importer"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                <span className="text-muted-foreground text-sm">Ne pas importer</span>
                                            </SelectItem>
                                            {tableColumns.map((col) => (
                                                <SelectItem key={col.name} value={col.name}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm">{col.name}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {col.type}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {mappedColumn && (
                                        <div className="flex gap-1.5 flex-wrap">
                                            {columnType && (
                                                <Badge variant="secondary" className="text-xs">
                                                    {columnType}
                                                </Badge>
                                            )}
                                            {required && (
                                                <Badge variant="destructive" className="text-xs">
                                                    requis
                                                </Badge>
                                            )}
                                            {confidence > 0.6 && (
                                                <Badge variant="outline" className="text-xs">
                                                    <Sparkles className="mr-1 h-3 w-3"/>
                                                    Auto ({Math.round(confidence * 100)}%)
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {previewData.length > 0 && getMappedColumns().length > 0 && (
                <Card className="p-3 mt-4">
                    <div className="space-y-2">
                        <div>
                            <Label className="text-sm font-semibold">Aperçu des données</Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Voici comment vos données seront importées (affichage des {previewData.length} premières
                                lignes)
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="border-b bg-muted/50">
                                    {getMappedColumns().map((mapping) => (
                                        <th key={mapping.tableColumn} className="text-left p-2 font-medium text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <span>{mapping.tableColumn}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {previewData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="border-b hover:bg-muted/30 transition-colors">
                                        {getMappedColumns().map((mapping) => (
                                            <td key={mapping.tableColumn} className="p-2 text-xs">
                                                <div className="truncate max-w-[200px]">
                                                    {(mapping.fileColumn && row[mapping.fileColumn]?.toString()) || (
                                                        <span className="text-muted-foreground italic">vide</span>
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}
