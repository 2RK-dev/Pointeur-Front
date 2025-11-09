"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Checkbox} from "@/components/ui/checkbox"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {Separator} from "@/components/ui/separator"
import {Card, CardContent} from "@/components/ui/card"
import {Download} from "lucide-react"
import {AVAILABLE_TABLES, type FileType} from "@/Tools/import";
import FileSelect from "@/app/(Main)/import-export/ui/import/fileSelect";
import {exportData} from "@/services/DataTransfer";
import {notifications} from "@/components/notifications";


export function ExportInterface() {
    const [selectedTables, setSelectedTables] = useState<string[]>([])
    const [exportFormat, setExportFormat] = useState<FileType>("csv")
    const [isExporting, setIsExporting] = useState(false)

    const handleTableToggle = (tableName: string) => {
        setSelectedTables((prev) => (prev.includes(tableName) ? prev.filter((t) => t !== tableName) : [...prev, tableName]))
    }

    const handleSelectAll = () => {
        if (selectedTables.length === AVAILABLE_TABLES.length) {
            setSelectedTables([])
        } else {
            setSelectedTables(AVAILABLE_TABLES.map((t) => t.name))
        }
    }

    const handleExport = async () => {
        if (selectedTables.length === 0) return

        setIsExporting(true)
        const promise = exportData(selectedTables, exportFormat).then((result) => {
            const url = window.URL.createObjectURL(result)
            const a = document.createElement("a")
            a.href = url
            a.download = `export.${exportFormat === "csv" ? "zip" : exportFormat}`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        })
        notifications.promise(promise, {
            loading: 'Exportation des données en cours...',
            success: "Exportation réussie !",
            error: 'Échec de l\'exportation des données.'
        })
        setIsExporting(false)

    }

    const handleFileTypeSelect = (type: FileType) => {
        setExportFormat(type)
    }


    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">1. Sélectionnez les tables à exporter</Label>
                    <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                        {selectedTables.length === AVAILABLE_TABLES.length ? "Tout désélectionner" : "Tout sélectionner"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {AVAILABLE_TABLES.map((table) => (
                        <Card
                            key={table.name}
                            className={`flex items-center cursor-pointer hover:border-primary/50 h-16  ${
                                selectedTables.includes(table.name) && "border-primary border-2 bg-primary/5 shadow-sm"
                            }`}
                            onClick={() => handleTableToggle(table.name)}
                        >
                            <CardContent className="p-3 py-0">
                                <div className="flex items-start gap-2">
                                    <Checkbox
                                        checked={selectedTables.includes(table.name)}
                                        onCheckedChange={() => handleTableToggle(table.name)}
                                        className="mt-0.5"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">

                                            <div className="font-medium text-sm truncate">{table.label}</div>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">


                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Separator/>

            <FileSelect selectedFileType={exportFormat} handleFileTypeSelect={handleFileTypeSelect}/>

            <Separator/>

            <div className="space-y-3">
                {selectedTables.length > 0 && (
                    <Alert className="py-2">
                        <AlertDescription className="text-sm">
                            Vous allez exporter <strong>{selectedTables.length} table(s) en </strong>
                            <strong>{exportFormat.toUpperCase()}</strong>.
                        </AlertDescription>
                    </Alert>
                )}

                <Button onClick={handleExport} disabled={selectedTables.length === 0 || isExporting}>
                    <Download className="mr-2 h-4 w-4"/>
                    {isExporting ? "Export en cours..." : "Exporter les données"}
                </Button>

            </div>
        </div>
    )
}
