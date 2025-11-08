export interface TableColumn {
  name: string
  type: "string" | "number" | "date" | "boolean"
}

export interface TableSchema {
  name: string
  label: string
  columns: TableColumn[]
}

export interface ColumnMapping {
  fileColumn: string
  tableColumn: string | null
  confidence?: number
}

export interface ParsedData {
  headers: string[]
  rows: Record<string, any>[]
  format: "csv" | "excel" | "json"
}

export interface FileSource {
  id: string
  file: File
  type: "csv" | "excel" | "json"
}

export interface ExcelSheetSource {
  id: string
  fileId: string
  sheetName: string
  data: ParsedData
}

export interface JsonSource {
  id: string
  fileId: string
  key: string | null // null means the whole file is the table
  data: ParsedData
}

export interface ImportMapping {
  sourceId: string
  sourceName: string
  sourceFileName: string
  sourceSubFileName: string | null
  sourceType: "csv" | "excel-sheet" | "json-key" | "json-file"
  tableName: string | null
  parsedData: ParsedData
  columnMappings: ColumnMapping[]
}

export interface MappingValidation {
  isValid: boolean
  unmappedRequired: string[]
  unmappedOptional: string[]
  mappedCount: number
  totalRequired: number
  totalColumns: number
}

export interface ImportSummary {
  totalSources: number
  totalRows: number
  validMappings: number
  invalidMappings: number
  mappingDetails: {
    sourceId: string
    sourceName: string
    tableName: string
    rowCount: number
    validation: MappingValidation
    mappingType: "auto" | "manual" | "mixed"
  }[]
}
