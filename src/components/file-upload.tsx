"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { File, X, FileSpreadsheet, FileJson } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export type FileType = "csv" | "excel" | "json"

interface FileUploadProps {
  fileType: FileType
  onFileTypeChange: (type: FileType) => void
  files: File[]
  onFilesChange: (files: File[]) => void
}

export function FileUpload({ fileType, onFileTypeChange, files, onFilesChange }: FileUploadProps) {
  const getAcceptedFiles = () => {
    switch (fileType) {
      case "csv":
        return { "text/csv": [".csv"] }
      case "excel":
        return {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
          "application/vnd.ms-excel": [".xls"],
        }
      case "json":
        return { "application/json": [".json"] }
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesChange([...files, ...acceptedFiles])
    },
    [files, onFilesChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptedFiles(),
    multiple: true,
  })

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  const getFileIcon = () => {
    switch (fileType) {
      case "csv":
        return <File className="h-8 w-8 text-primary" />
      case "excel":
        return <FileSpreadsheet className="h-8 w-8 text-primary" />
      case "json":
        return <FileJson className="h-8 w-8 text-primary" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">Type de fichier</Label>
        <RadioGroup value={fileType} onValueChange={(v) => onFileTypeChange(v as FileType)}>
          <div className="grid grid-cols-3 gap-4">
            <Card
              className={`p-4 cursor-pointer transition-all ${fileType === "csv" ? "border-primary bg-accent" : ""}`}
              onClick={() => onFileTypeChange("csv")}
            >
              <RadioGroupItem value="csv" id="csv" className="sr-only" />
              <Label htmlFor="csv" className="cursor-pointer flex flex-col items-center gap-2">
                <File className="h-6 w-6" />
                <span className="font-medium">CSV</span>
              </Label>
            </Card>

            <Card
              className={`p-4 cursor-pointer transition-all ${fileType === "excel" ? "border-primary bg-accent" : ""}`}
              onClick={() => onFileTypeChange("excel")}
            >
              <RadioGroupItem value="excel" id="excel" className="sr-only" />
              <Label htmlFor="excel" className="cursor-pointer flex flex-col items-center gap-2">
                <FileSpreadsheet className="h-6 w-6" />
                <span className="font-medium">Excel</span>
              </Label>
            </Card>

            <Card
              className={`p-4 cursor-pointer transition-all ${fileType === "json" ? "border-primary bg-accent" : ""}`}
              onClick={() => onFileTypeChange("json")}
            >
              <RadioGroupItem value="json" id="json" className="sr-only" />
              <Label htmlFor="json" className="cursor-pointer flex flex-col items-center gap-2">
                <FileJson className="h-6 w-6" />
                <span className="font-medium">JSON</span>
              </Label>
            </Card>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Fichiers</Label>
        <Card
          {...getRootProps()}
          className={`p-8 border-2 border-dashed cursor-pointer transition-all ${
            isDragActive ? "border-primary bg-accent" : ""
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3 text-center">
            {getFileIcon()}
            <div>
              <p className="font-medium">
                {isDragActive
                  ? "Déposez les fichiers ici"
                  : "Glissez-déposez vos fichiers ou cliquez pour sélectionner"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Vous pouvez ajouter plusieurs fichiers {fileType.toUpperCase()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <Label className="text-base font-semibold">Fichiers sélectionnés ({files.length})</Label>
          <div className="space-y-2">
            {files.map((file, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon()}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
