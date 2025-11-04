"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileSpreadsheet, FileJson, FileText, CheckCircle2, Database } from "lucide-react"

const AVAILABLE_TABLES = [
  { name: "users", label: "Utilisateurs", rowCount: 1250, icon: "👥" },
  { name: "products", label: "Produits", rowCount: 450, icon: "📦" },
  { name: "orders", label: "Commandes", rowCount: 3200, icon: "🛒" },
  { name: "categories", label: "Catégories", rowCount: 25, icon: "📁" },
  { name: "reviews", label: "Avis", rowCount: 890, icon: "⭐" },
  { name: "suppliers", label: "Fournisseurs", rowCount: 67, icon: "🏭" },
]

type ExportFormat = "csv" | "excel" | "json"

export function ExportInterface() {
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv")
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

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
    setExportSuccess(false)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch (error) {
      console.error("Erreur lors de l'export:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case "json":
        return <FileJson className="h-5 w-5" />
      case "csv":
        return <FileText className="h-5 w-5" />
      case "excel":
        return <FileSpreadsheet className="h-5 w-5" />
    }
  }

  const totalRows = AVAILABLE_TABLES.filter((t) => selectedTables.includes(t.name)).reduce(
    (sum, t) => sum + t.rowCount,
    0,
  )

  return (
    <div className="space-y-6">
      {/* Sélection des tables */}
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
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                selectedTables.includes(table.name) ? "border-primary border-2 bg-primary/5" : "border-border"
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

      <Separator />

      {/* Sélection du format */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">2. Choisissez le format d'export</Label>
        <RadioGroup value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                exportFormat === "csv" ? "border-primary border-2 bg-primary/5" : "border-border"
              }`}
              onClick={() => setExportFormat("csv")}
            >
              <CardContent className="p-3 py-0">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer flex-1">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium text-sm">CSV</div>
                      <div className="text-xs text-muted-foreground">Fichier texte</div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                exportFormat === "excel" ? "border-primary border-2 bg-primary/5" : "border-border"
              }`}
              onClick={() => setExportFormat("excel")}
            >
              <CardContent className="p-3 py-0">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="flex items-center gap-2 cursor-pointer flex-1">
                    <FileSpreadsheet className="h-4 w-4" />
                    <div>
                      <div className="font-medium text-sm">Excel</div>
                      <div className="text-xs text-muted-foreground">Tableur .xlsx</div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                exportFormat === "json" ? "border-primary border-2 bg-primary/5" : "border-border"
              }`}
              onClick={() => setExportFormat("json")}
            >
              <CardContent className="p-3 py-0">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer flex-1">
                    <FileJson className="h-4 w-4" />
                    <div>
                      <div className="font-medium text-sm">JSON</div>
                      <div className="text-xs text-muted-foreground">Format API</div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Bouton d'export */}
      <div className="space-y-3">
        {selectedTables.length > 0 && (
          <Alert className="py-2">
            <AlertDescription className="text-sm">
              Vous allez exporter <strong>{selectedTables.length} table(s)</strong> contenant un total de{" "}
              <strong>{totalRows.toLocaleString()} lignes</strong> au format{" "}
              <strong>{exportFormat.toUpperCase()}</strong>.
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={handleExport} disabled={selectedTables.length === 0 || isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Export en cours..." : "Exporter les données"}
        </Button>

        {exportSuccess && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950 py-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800 dark:text-green-200">
              Export réussi ! Le téléchargement devrait commencer automatiquement.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
