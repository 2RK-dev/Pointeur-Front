"use client"

import type React from "react"
import {useCallback, useState} from "react"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {AlertCircle, CheckCircle2, FileJson, FileSpreadsheet, FileText, Loader2, Table, Upload, X} from "lucide-react"
import {ColumnMapper} from "@/components/column-mapper"
import {ImportSummary} from "@/components/import-summary"
import {
    autoMapColumns,
    generateImportSummary, parseCSV,
    parseExcelSheets,
    parseJSONSources,
    validateMapping,
} from "@/lib/import-utils"
import type {ExcelSheetSource, FileSource, ImportMapping, JsonSource, TableSchema} from "@/lib/types"
import FileSelect from "@/app/(Main)/import-export/ui/import/fileSelect";
import {getFileIcon} from "@/app/(Main)/import-export/ui/import/importUtils";

const AVAILABLE_TABLES: TableSchema[] = [
    {
        name: "users",
        label: "Utilisateurs",
        columns: [
            {name: "id", type: "number", required: true},
            {name: "email", type: "string", required: true},
            {name: "first_name", type: "string", required: false},
            {name: "last_name", type: "string", required: false},
            {name: "created_at", type: "date", required: false},
        ],
    },
    {
        name: "products",
        label: "Produits",
        columns: [
            {name: "id", type: "number", required: true},
            {name: "name", type: "string", required: true},
            {name: "description", type: "string", required: false},
            {name: "price", type: "number", required: true},
            {name: "stock", type: "number", required: false},
        ],
    },
    {
        name: "orders",
        label: "Commandes",
        columns: [
            {name: "id", type: "number", required: true},
            {name: "user_id", type: "number", required: true},
            {name: "product_id", type: "number", required: true},
            {name: "quantity", type: "number", required: true},
            {name: "total", type: "number", required: true},
            {name: "order_date", type: "date", required: false},
        ],
    },
    {
        name: "categories",
        label: "Catégories",
        columns: [
            {name: "id", type: "number", required: true},
            {name: "name", type: "string", required: true},
            {name: "parent_id", type: "number", required: false},
        ],
    },
]

type FileType = "csv" | "excel" | "json"


export function ImportInterface() {
    const [selectedFileType, setSelectedFileType] = useState<FileType | null>(null)
    const [files, setFiles] = useState<FileSource[]>([])
    const [excelSheets, setExcelSheets] = useState<ExcelSheetSource[]>([])
    const [jsonSources, setJsonSources] = useState<JsonSource[]>([])
    const [importMappings, setImportMappings] = useState<ImportMapping[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [showSummary, setShowSummary] = useState(false)

    const handleFileTypeSelect = (type: FileType) => {
        setSelectedFileType(type)
        setFiles([])
        setExcelSheets([])
        setJsonSources([])
        setImportMappings([])
        setShowSummary(false)
    }

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = Array.from(e.target.files || [])
            if (selectedFiles.length === 0 || !selectedFileType) return

            setIsProcessing(true)
            setImportStatus("idle")
            setErrorMessage("")

            try {
                const newFiles: FileSource[] = selectedFiles.map((file, index) => ({
                    id: `file-${Date.now()}-${index}`,
                    file,
                    type: selectedFileType,
                }))

                setFiles((prev) => [...prev, ...newFiles])

                if (selectedFileType === "csv") {
                    const newMappings: ImportMapping[] = []
                    for (const fileSource of newFiles) {
                        const data = await parseCSV(fileSource.file)
                        newMappings.push({
                            sourceId: fileSource.id,
                            sourceName: fileSource.file.name, sourceType: "csv",
                            tableName: null,
                            parsedData: data,
                            columnMappings: [],
                        })
                    }
                    setImportMappings((prev) => [...prev, ...newMappings])
                } else if (selectedFileType === "excel") {
                    for (const fileSource of newFiles) {
                        const sheets = await parseExcelSheets(fileSource.file, fileSource.id)
                        setExcelSheets((prev) => [...prev, ...sheets])
                        const newMappings: ImportMapping[] = sheets.map((sheet) => ({
                            sourceId: sheet.id,
                            sourceName: `${fileSource.file.name} - ${sheet.sheetName}`,
                            sourceType: "excel-sheet",
                            tableName: null,
                            parsedData: sheet.data,
                            columnMappings: [],
                        }))
                        setImportMappings((prev) => [...prev, ...newMappings])
                    }
                } else if (selectedFileType === "json") {
                    for (const fileSource of newFiles) {
                        const sources = await parseJSONSources(fileSource.file, fileSource.id)
                        setJsonSources((prev) => [...prev, ...sources])
                        const newMappings: ImportMapping[] = sources.map((source) => ({
                            sourceId: source.id,
                            sourceName: source.key ? `${fileSource.file.name} - ${source.key}` : fileSource.file.name,
                            sourceType: source.key ? "json-key" : "json-file",
                            tableName: null,
                            parsedData: source.data,
                            columnMappings: [],
                        }))
                        setImportMappings((prev) => [...prev, ...newMappings])
                    }
                }

            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : "Erreur lors de la lecture du fichier")
                setImportStatus("error")
            } finally {
                setIsProcessing(false)
            }
        },
        [selectedFileType],
    )

    const handleTableSelect = (mappingIndex: number, tableName: string) => {
        setImportMappings((prev) => {
            const updated = [...prev]
            updated[mappingIndex].tableName = tableName

            const table = AVAILABLE_TABLES.find((t) => t.name === tableName)
            if (table) {
                updated[mappingIndex].columnMappings = autoMapColumns(updated[mappingIndex].parsedData.headers, table.columns)
            }

            return updated
        })
    }

    const handleRemoveSource = (sourceId: string) => {
        setImportMappings((prev) => prev.filter((m) => m.sourceId !== sourceId))
        setFiles((prev) => prev.filter((f) => f.id !== sourceId))

    }

    const handleShowSummary = () => {
        setShowSummary(true)
    }

    const handleImport = async () => {
        const validMappings = importMappings.filter((m) => m.tableName && m.columnMappings.length > 0)
        if (validMappings.length === 0) return

        setIsProcessing(true)
        setImportStatus("idle")

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            setImportStatus("success")
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Erreur lors de l'import")
            setImportStatus("error")
        } finally {
            setIsProcessing(false)
        }
    }




    const summary = generateImportSummary(importMappings, AVAILABLE_TABLES)
    const canProceedToSummary = importMappings.some((m) => m.tableName && m.columnMappings.length > 0)

    if (showSummary) {
        return (
            <div className="space-y-4">
                <ImportSummary
                    summary={summary}
                    onBack={() => {
                        setShowSummary(false)
                    }}
                    onConfirm={handleImport}
                    isProcessing={isProcessing}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">

            <FileSelect selectedFileType={selectedFileType} handleFileTypeSelect={handleFileTypeSelect} />

            {selectedFileType && (
                <>
                    <Separator/>
                    <div className="space-y-3 space-x-2">
                        <Label className="text-sm font-semibold">Choisissez vos fichiers</Label>
                        <Button
                            variant="outline"
                            className="relative bg-transparent hover:bg-accent transition-colors"
                            disabled={isProcessing}
                            size="sm"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Traitement...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4"/>
                                    Sélectionner des fichiers {selectedFileType.toUpperCase()}
                                </>
                            )}
                            <input
                                type="file"
                                accept={selectedFileType === "csv" ? ".csv" : selectedFileType === "excel" ? ".xlsx,.xls" : ".json"}
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={isProcessing}
                                multiple
                            />
                        </Button>

                        {files.length > 0 && (
                            <div className="space-y-2">
                                {files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center gap-2 p-2 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="h-4 w-4">{getFileIcon(file.type)}</div>
                                        <span className="flex-1 text-sm font-medium truncate">{file.file.name}</span>
                                        <Badge variant="secondary" className="text-xs">
                                            {(file.file.size / 1024).toFixed(1)} KB
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive transition-colors"
                                            onClick={() => handleRemoveSource(file.id)}
                                        >
                                            <X className="h-3 w-3"/>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Step 3: Map sources to tables */}
            {importMappings.length > 0 && (
                <>
                    <Separator/>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold">Associez chaque source à une table</Label>
                            <Badge
                                variant={summary.validMappings === importMappings.length ? "default" : "secondary"}
                                className="text-xs"
                            >
                                {summary.validMappings}/{importMappings.length} valides
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {importMappings.map((mapping, index) => {
                                const table = AVAILABLE_TABLES.find((t) => t.name === mapping.tableName)
                                const validation = table ? validateMapping(mapping.columnMappings, table.columns) : null

                                return (
                                    <Card
                                        key={mapping.sourceId}
                                        className={`transition-all ${
                                            validation && !validation.isValid
                                                ? "border-orange-500 shadow-sm"
                                                : validation?.isValid
                                                    ? "border-green-500/30"
                                                    : ""
                                        }`}
                                    >
                                        <CardHeader className="pb-2 pt-3 px-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Table className="h-4 w-4 text-muted-foreground"/>
                                                    <div>
                                                        <CardTitle className="text-sm">{mapping.sourceName}</CardTitle>
                                                        <CardDescription className="text-xs">
                                                            {mapping.parsedData.rows.length} lignes détectées
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {validation && (
                                                        <Badge
                                                            variant={validation.isValid ? "default" : "destructive"}
                                                            className={validation.isValid ? "bg-green-500 text-xs" : "text-xs"}
                                                        >
                                                            {validation.isValid ? (
                                                                <>
                                                                    <CheckCircle2 className="mr-1 h-3 w-3"/>
                                                                    Valide
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <AlertCircle className="mr-1 h-3 w-3"/>
                                                                    Invalide
                                                                </>
                                                            )}
                                                        </Badge>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                        onClick={() => handleRemoveSource(mapping.sourceId)}
                                                    >
                                                        <X className="h-3 w-3"/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3 px-4 pb-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs">Table de destination</Label>
                                                <Select
                                                    value={mapping.tableName || ""}
                                                    onValueChange={(value) => handleTableSelect(index, value)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue placeholder="Sélectionnez une table"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {AVAILABLE_TABLES.map((table) => (
                                                            <SelectItem key={table.name} value={table.name}>
                                <span className="text-sm">
                                  {table.label} ({table.columns.length} colonnes)
                                </span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {table && mapping.columnMappings.length > 0 && (
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Mapping des colonnes</Label>
                                                    <ColumnMapper
                                                        fileHeaders={mapping.parsedData.headers}
                                                        tableColumns={table.columns}
                                                        mappings={mapping.columnMappings}
                                                        onMappingsChange={(newMappings) => {
                                                            setImportMappings((prev) => {
                                                                const updated = [...prev]
                                                                updated[index].columnMappings = newMappings
                                                                return updated
                                                            })
                                                        }}
                                                        previewData={mapping.parsedData.rows.slice(0, 3)}
                                                    />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}

            {/* Step 4: Review and Import */}
            {canProceedToSummary && (
                <>
                    <Separator/>
                    <div className="space-y-3">
                        {summary.invalidMappings > 0 ? (
                            <Alert variant="destructive" className="py-2">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertDescription className="text-sm">
                                    <strong>{summary.invalidMappings} source(s)</strong> ont des champs requis non
                                    mappés. Corrigez les
                                    mappings avant de continuer.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert className="border-green-500 bg-green-50 dark:bg-green-950 py-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600"/>
                                <AlertDescription className="text-sm text-green-800 dark:text-green-200">
                                    Tous les mappings sont valides ! Prêt à
                                    importer <strong>{summary.totalRows} lignes</strong> dans{" "}
                                    <strong>{summary.validMappings} table(s)</strong>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            onClick={handleShowSummary}
                            disabled={summary.validMappings === 0}
                            className="transition-all hover:shadow-md"
                        >
                            Voir le résumé et confirmer
                        </Button>

                        {importStatus === "success" && (
                            <Alert className="border-green-500 bg-green-50 dark:bg-green-950 py-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600"/>
                                <AlertDescription className="text-sm text-green-800 dark:text-green-200">
                                    Import réussi ! {summary.totalRows} lignes ont été importées.
                                </AlertDescription>
                            </Alert>
                        )}

                        {importStatus === "error" && (
                            <Alert variant="destructive" className="py-2">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertDescription className="text-sm">{errorMessage}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
