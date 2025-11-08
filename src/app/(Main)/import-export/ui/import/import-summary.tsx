"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Table,
  ArrowLeft,
  Download,
  Sparkles,
  User,
  AlertTriangle,
} from "lucide-react"
import type { ImportSummary as ImportSummaryType } from "@/lib/types"

interface ImportSummaryProps {
  summary: ImportSummaryType
  onBack: () => void
  onConfirm: () => void
  isProcessing: boolean
}

export function ImportSummary({ summary, onBack, onConfirm, isProcessing }: ImportSummaryProps) {
  const canImport = summary.invalidMappings === 0 && summary.validMappings > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Résumé de l'importation</h3>
          <p className="text-sm text-muted-foreground">Vérifiez les détails avant de confirmer l'import</p>
        </div>
        <Button variant="outline" size="sm" onClick={onBack} disabled={isProcessing}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      <Separator />

      {/* Global statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{summary.totalSources}</div>
                <div className="text-xs text-muted-foreground">Sources</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Table className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{summary.validMappings}</div>
                <div className="text-xs text-muted-foreground">Tables valides</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{summary.totalRows}</div>
                <div className="text-xs text-muted-foreground">Lignes totales</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {summary.invalidMappings > 0 ? (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              <div>
                <div className="text-2xl font-bold">{summary.invalidMappings}</div>
                <div className="text-xs text-muted-foreground">Erreurs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation alerts */}
      {summary.invalidMappings > 0 && (
        <Alert variant="destructive" className="py-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>{summary.invalidMappings} source(s)</strong> ont des champs requis non mappés. Vous devez corriger
            ces mappings avant de pouvoir importer.
          </AlertDescription>
        </Alert>
      )}

      {canImport && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950 py-3">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-sm text-green-800 dark:text-green-200">
            Tous les mappings sont valides ! Vous pouvez procéder à l'importation de{" "}
            <strong>{summary.totalRows} lignes</strong> dans <strong>{summary.validMappings} table(s)</strong>.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed mapping information */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Détails des mappings</h4>
        {summary.mappingDetails.map((detail) => (
          <Card key={detail.sourceId} className={!detail.validation.isValid ? "border-orange-500" : ""}>
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    {detail.sourceName}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Table: <strong>{detail.tableName}</strong> • {detail.rowCount} lignes
                  </CardDescription>
                </div>
                <div className="flex gap-1.5">
                  {detail.mappingType === "auto" && (
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Auto
                    </Badge>
                  )}
                  {detail.mappingType === "manual" && (
                    <Badge variant="outline" className="text-xs">
                      <User className="mr-1 h-3 w-3" />
                      Manuel
                    </Badge>
                  )}
                  {detail.mappingType === "mixed" && (
                    <Badge variant="outline" className="text-xs">
                      Mixte
                    </Badge>
                  )}
                  {detail.validation.isValid ? (
                    <Badge variant="default" className="bg-green-500 text-xs">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Valide
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Invalide
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Colonnes mappées</span>
                  <span className="font-medium">
                    {detail.validation.mappedCount} / {detail.validation.totalColumns}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Champs requis mappés</span>
                  <span className="font-medium">
                    {detail.validation.totalRequired - detail.validation.unmappedRequired.length} /{" "}
                    {detail.validation.totalRequired}
                  </span>
                </div>

                {detail.validation.unmappedRequired.length > 0 && (
                  <Alert variant="destructive" className="py-2 mt-2">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      <strong>Champs requis non mappés:</strong> {detail.validation.unmappedRequired.join(", ")}
                    </AlertDescription>
                  </Alert>
                )}

                {detail.validation.unmappedOptional.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Champs optionnels non mappés: {detail.validation.unmappedOptional.join(", ")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack} disabled={isProcessing} className="flex-1 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Modifier les mappings
        </Button>
        <Button onClick={onConfirm} disabled={!canImport || isProcessing} className="flex-1">
          {isProcessing ? (
            "Import en cours..."
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirmer l'import
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
