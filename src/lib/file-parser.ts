import { loadXLSX } from "./xlsx-loader"

export interface ParsedData {
  headers: string[]
  rows: Record<string, any>[]
}

export interface FileSource {
  fileName: string
  sheetName?: string
  jsonPath?: string
}

export async function parseCSV(file: File): Promise<ParsedData> {
  const text = await file.text()
  const lines = text.split("\n").filter((line) => line.trim())

  if (lines.length === 0) {
    return { headers: [], rows: [] }
  }

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
    const row: Record<string, any> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ""
    })
    return row
  })

  return { headers, rows }
}

export async function parseExcel(file: File): Promise<Map<string, ParsedData>> {
  const XLSX = await loadXLSX()
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array" })

  const sheetsData = new Map<string, ParsedData>()

  workbook.SheetNames.forEach((sheetName: string) => {
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    if (jsonData.length === 0) {
      sheetsData.set(sheetName, { headers: [], rows: [] })
      return
    }

    const headers = jsonData[0].map((h) => String(h || "").trim())
    const rows = jsonData.slice(1).map((row) => {
      const rowObj: Record<string, any> = {}
      headers.forEach((header, index) => {
        rowObj[header] = row[index] !== undefined ? row[index] : ""
      })
      return rowObj
    })

    sheetsData.set(sheetName, { headers, rows })
  })

  return sheetsData
}

export async function parseJSON(file: File): Promise<any> {
  const text = await file.text()
  return JSON.parse(text)
}

export function extractJSONData(jsonData: any, path?: string): ParsedData {
  let data = jsonData

  if (path) {
    const keys = path.split(".")
    for (const key of keys) {
      data = data[key]
      if (!data) break
    }
  }

  if (!Array.isArray(data)) {
    data = [data]
  }

  if (data.length === 0) {
    return { headers: [], rows: [] }
  }

  const headers = Object.keys(data[0])
  return { headers, rows: data }
}

export function detectBestMapping(fileHeaders: string[], tableColumns: string[]): Map<string, string> {
  const mapping = new Map<string, string>()

  fileHeaders.forEach((fileHeader) => {
    const normalized = fileHeader.toLowerCase().replace(/[_\s-]/g, "")

    let bestMatch = ""
    let bestScore = 0

    tableColumns.forEach((tableColumn) => {
      const tableNormalized = tableColumn.toLowerCase().replace(/[_\s-]/g, "")

      if (normalized === tableNormalized) {
        bestMatch = tableColumn
        bestScore = 100
      } else if (normalized.includes(tableNormalized) || tableNormalized.includes(normalized)) {
        const score = Math.max(normalized.length / tableNormalized.length, tableNormalized.length / normalized.length)
        if (score > bestScore) {
          bestMatch = tableColumn
          bestScore = score
        }
      }
    })

    if (bestMatch) {
      mapping.set(fileHeader, bestMatch)
    }
  })

  return mapping
}
