"use client"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {ImportInterface} from "@/app/(Main)/import-export/ui/import-interface"
import {ExportInterface} from "@/app/(Main)/import-export/ui/export-interface"
import {Download, Upload} from "lucide-react"

export default function DataManagementPage() {
  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Import / Export de Données</CardTitle>
            <CardDescription>Sélectionnez les tables et gérez vos données en CSV, Excel ou JSON</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="import" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="import" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Importer
                </TabsTrigger>
                <TabsTrigger value="export" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exporter
                </TabsTrigger>
              </TabsList>

              <TabsContent value="import" className="mt-6">
                <ImportInterface />

              </TabsContent>

              <TabsContent value="export" className="mt-6">
                <ExportInterface />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
    </div>
  )
}
