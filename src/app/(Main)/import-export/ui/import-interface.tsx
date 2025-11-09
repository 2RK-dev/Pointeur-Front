"use client"

import React, {useCallback, useState} from "react"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {AlertCircle, CheckCircle2, Loader2, Table, Upload, X} from "lucide-react"
import {ColumnMapper} from "@/app/(Main)/import-export/ui/import/column-mapper"
import {ImportSummary} from "@/app/(Main)/import-export/ui/import/import-summary"
import {
    autoMapColumns,
    generateImportSummary,
    parseCSV,
    parseExcelSheets,
    parseJSONSources,
    validateMapping,
} from "@/lib/import-utils"
import type {FileSource, ImportMapping} from "@/lib/types"
import FileSelect from "@/app/(Main)/import-export/ui/import/fileSelect";
import {AVAILABLE_TABLES, FileType, getFileIcon} from "@/Tools/import";
import {importData} from "@/services/DataTransfer";
import {notifications} from "@/components/notifications";
import {ImportResultShow as ImportResultShow} from "@/app/(Main)/EDT/ui/import-result-show";
import {ResultImport} from "@/Types/glob";
import {Checkbox} from "@/components/ui/checkbox";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";


export function ImportInterface() {
    const [selectedFileType, setSelectedFileType] = useState<FileType | null>(null)
    const [files, setFiles] = useState<FileSource[]>([])
    const [importMappings, setImportMappings] = useState<ImportMapping[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [showSummary, setShowSummary] = useState(false)
    const [importResultShowIsClosing, setImportResultShowIsClosing] = useState(true);
    const [resultImport, setResultImport] = useState<ResultImport | null>(null)
    const [isDeleteOldData, setIsDeleteOldData] = useState<boolean>(false);


    const onClose = () => {
        setTimeout(() => {
            setImportResultShowIsClosing(true);
        }, 300);
    }

    const handleFileTypeSelect = (type: FileType) => {
        setSelectedFileType(type)
        setFiles([])
        setImportMappings([])
        setShowSummary(false)
    }

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFiles = Array.from(e.target.files || [])
            if (selectedFiles.length === 0 || !selectedFileType) return
            setIsProcessing(true)
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
                            sourceName: fileSource.file.name,
                            sourceFileName: fileSource.file.name,
                            sourceSubFileName: null,
                            sourceType: "csv",
                            tableName: null,
                            parsedData: data,
                            columnMappings: [],
                        })
                    }
                    setImportMappings((prev) => [...prev, ...newMappings])
                } else if (selectedFileType === "excel") {
                    for (const fileSource of newFiles) {
                        const sheets = await parseExcelSheets(fileSource.file, fileSource.id)
                        const newMappings: ImportMapping[] = sheets.map((sheet) => ({
                            sourceId: sheet.id,
                            sourceName: `${fileSource.file.name} - ${sheet.sheetName}`,
                            sourceFileName: fileSource.file.name,
                            sourceSubFileName: sheet.sheetName,
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
                        const newMappings: ImportMapping[] = sources.map((source) => ({
                            sourceId: source.id,
                            sourceName: source.key ? `${fileSource.file.name} - ${source.key}` : fileSource.file.name,
                            sourceFileName: fileSource.file.name,
                            sourceSubFileName: source.key,
                            sourceType: source.key ? "json-key" : "json-file",
                            tableName: null,
                            parsedData: source.data,
                            columnMappings: [],
                        }))
                        setImportMappings((prev) => [...prev, ...newMappings])
                    }
                }

            } catch (error) {
                notifications.error("Erreur lors du traitement des fichiers.", "Veuillez vérifier le format des fichiers et réessayer.")
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
        setFiles((prev) => prev.filter((f) => f.id !== sourceId))
        setImportMappings((prev) =>
            prev.filter((m) =>
                m.sourceId !== sourceId &&
                !m.sourceId.startsWith(sourceId + "-")
            )
        )
    }

    const handleShowSummary = () => {
        setShowSummary(true)
    }

    const handleImport = async () => {
        const validMappings = importMappings.filter((m) => m.tableName && m.columnMappings.length > 0)
        if (validMappings.length === 0) return
        setIsProcessing(true)
        const promise = importData(files, validMappings, isDeleteOldData).then((result) => {
            setResultImport(result);
            setImportResultShowIsClosing(false)
        })
        notifications.promise(promise, {
            loading: 'Importation en cours...',
            success: 'Importation réussie !',
            error: 'Erreur lors de l\'importation.',
        })
        setIsProcessing(false)
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

            <FileSelect selectedFileType={selectedFileType} handleFileTypeSelect={handleFileTypeSelect}/>

            <Label
                className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                <Checkbox
                    id="toggle-2"
                    defaultChecked
                    checked={isDeleteOldData}
                    onCheckedChange={() => {
                        setIsDeleteOldData(!isDeleteOldData)
                    }}
                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                />
                <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                        Remplacer en cas de conflit
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Si activé, les données importées remplaceront celles existantes ayant le même ID. Sinon, les
                        enregistrements conflictuels seront ignorés.
                    </p>
                </div>
            </Label>

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

                        <Accordion type="single"
                                   collapsible
                                   className="w-full"
                                   defaultValue={importMappings.length > 0 ? importMappings[0].sourceId : undefined}>
                            {importMappings.map((mapping, index) => {
                                const table = AVAILABLE_TABLES.find((t) => t.name === mapping.tableName)
                                const validation = table ? validateMapping(mapping.columnMappings, table.columns) : null

                                return (
                                    <AccordionItem value={mapping.sourceId}
                                                   key={mapping.sourceId}
                                                   className={`transition-all ${
                                                       validation && !validation.isValid
                                                           ? "border-orange-500 shadow-sm"
                                                           : validation?.isValid
                                                               ? "border-green-500/30"
                                                               : ""
                                                   }`}
                                    >
                                        <AccordionTrigger className="pb-2 pt-3 px-4 ">
                                            <div className="flex items-center justify-between mr-4 w-full">
                                                <div className="flex items-center gap-2">
                                                    <Table className="h-4 w-4 text-muted-foreground"/>
                                                    <div>
                                                        <p className="text-sm">{mapping.sourceName}</p>
                                                        <p className="text-xs">
                                                            {mapping.parsedData.rows.length} lignes détectées
                                                        </p>
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
                                                            )}</Badge>
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
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-3 px-4 pb-4">
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
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </div>
                </>
            )}

            {canProceedToSummary && (
                <>
                    <Separator/>
                    <div className="space-y-3">
                        {summary.invalidMappings > 0 ? (
                            <Alert variant="destructive" className="py-2">
                                <AlertDescription className="text-sm flex flex-row items-center gap-2">
                                    <AlertCircle className="h-4 w-4"/>
                                    <strong>{summary.invalidMappings} source(s)</strong> ont des champs requis non
                                    mappés. Corrigez les
                                    mappings avant de continuer.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert className="border-green-500 bg-green-50 dark:bg-green-950 py-2">
                                <AlertDescription className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                                    <CheckCircle2 className="h-4 w-4 text-green-600"/> Tous les mappings sont valides ! Prêt à
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

                    </div>
                </>
            )}
            <ImportResultShow
                successItems={resultImport?.success || []}
                failedItems={resultImport?.failed || []}
                isClosing={importResultShowIsClosing}
                onClose={onClose}
            />
        </div>
    )
}
