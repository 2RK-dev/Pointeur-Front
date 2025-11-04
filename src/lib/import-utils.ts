import type {
  ParsedData,
  TableColumn,
  ColumnMapping,
  ExcelSheetSource,
  JsonSource,
  ImportMapping,
  TableSchema,
  ImportSummary,
  MappingValidation,
} from "./types"
import { loadXLSX } from "./xlsx-loader"

export async function parseExcelSheets(file: File, fileId: string): Promise<ExcelSheetSource[]> {
  const XLSX = await loadXLSX()
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array" })

  return workbook.SheetNames.map((sheetName: string | number, index: any) => {
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]

    if (data.length < 1) {
      return {
        id: `${fileId}-sheet-${index}`,
        fileId,
        sheetName,
        data: {
          headers: [],
          rows: [],
          format: "excel" as const,
        },
      }
    }

    const headers = data[0]?.map((h) => String(h).trim()) || []
    const rows = data.slice(1).map((row) => {
      const rowData: Record<string, any> = {}
      headers.forEach((header, index) => {
        rowData[header] = row[index] !== undefined ? row[index] : ""
      })
      return rowData
    })

    return {
      id: `${fileId}-sheet-${index}`,
      fileId,
      sheetName,
      data: {
        headers,
        rows,
        format: "excel" as const,
      },
    }
  })
}

export async function parseJSONSources(file: File, fileId: string): Promise<JsonSource[]> {
  const text = await file.text()
  const data = JSON.parse(text)

  // Case 1: Array of objects (whole file is one table)
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error("Le fichier JSON est vide")
    }
    const headers = Object.keys(data[0])
    return [
      {
        id: `${fileId}-json-file`,
        fileId,
        key: null,
        data: {
          headers,
          rows: data,
          format: "json",
        },
      },
    ]
  }

  // Case 2: Object with keys (each key is a potential table)
  if (typeof data === "object" && data !== null) {
    const sources: JsonSource[] = []
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value) && value.length > 0) {
        const headers = Object.keys(value[0])
        sources.push({
          id: `${fileId}-json-${key}`,
          fileId,
          key,
          data: {
            headers,
            rows: value,
            format: "json",
          },
        })
      }
    }
    if (sources.length === 0) {
      throw new Error("Aucune donnée valide trouvée dans le fichier JSON")
    }
    return sources
  }

  throw new Error("Format JSON non supporté")
}

export async function parseCSV(file: File): Promise<ParsedData> {
  const text = await file.text()
  const lines = text.split("\n").filter((line) => line.trim())

  if (lines.length < 2) {
    throw new Error("Le fichier CSV doit contenir au moins une ligne d'en-tête et une ligne de données")
  }

  const separator = lines[0].includes(";") ? ";" : ","

  const headers = lines[0].split(separator).map((h) => h.trim().replace(/^"|"$/g, ""))
  const rows = lines.slice(1).map((line) => {
    const values = line.split(separator).map((v) => v.trim().replace(/^"|"$/g, ""))
    const row: Record<string, any> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ""
    })
    return row
  })

  return {
    headers,
    rows,
    format: "csv",
  }
}

export function autoMapColumns(fileHeaders: string[], tableColumns: TableColumn[]): ColumnMapping[] {
  return fileHeaders.map((fileHeader) => {
    const normalizedFileHeader = normalizeColumnName(fileHeader)

    // 1. Chercher une correspondance exacte
    let matchedColumn = tableColumns.find((col) => normalizeColumnName(col.name) === normalizedFileHeader)
    let confidence = matchedColumn ? 1.0 : 0

    // 2. Si pas de correspondance exacte, chercher une correspondance partielle
    if (!matchedColumn) {
      matchedColumn = tableColumns.find((col) => {
        const normalizedColName = normalizeColumnName(col.name)
        return normalizedFileHeader.includes(normalizedColName) || normalizedColName.includes(normalizedFileHeader)
      })
      confidence = matchedColumn ? 0.8 : 0
    }

    // 3. Correspondances spéciales communes avec meilleure détection
    if (!matchedColumn) {
      const specialMappings: Record<string, string[]> = {
        email: ["mail", "e-mail", "courriel", "email", "emailaddress"],
        first_name: ["prenom", "firstname", "fname", "prenomutilisateur", "nom1"],
        last_name: ["nom", "lastname", "lname", "nomfamille", "nom2"],
        phone: ["telephone", "tel", "mobile", "cellulaire", "phonenumber"],
        created_at: ["date", "created", "creation", "datecreation", "createdat"],
        updated_at: ["updated", "modification", "datemodification", "updatedat"],
        price: ["prix", "cost", "cout", "montant", "tarif"],
        quantity: ["quantite", "qty", "qte", "nombre", "amount"],
        description: ["desc", "details", "info", "information"],
        name: ["nom", "libelle", "titre", "title"],
        id: ["identifiant", "code", "reference", "ref"],
        user_id: ["userid", "utilisateurid", "idutilisateur"],
        product_id: ["productid", "produitid", "idproduit"],
        order_date: ["datecommande", "orderdate", "dateorder"],
        total: ["montanttotal", "totalmontant", "somme"],
        stock: ["inventaire", "disponible", "quantitedisponible"],
      }

      for (const [colName, aliases] of Object.entries(specialMappings)) {
        if (aliases.some((alias) => normalizedFileHeader.includes(alias) || alias.includes(normalizedFileHeader))) {
          matchedColumn = tableColumns.find((col) => col.name === colName)
          if (matchedColumn) {
            confidence = 0.7
            break
          }
        }
      }
    }

    // 4. Utiliser la similarité de Levenshtein pour les cas difficiles
    if (!matchedColumn) {
      let bestMatch: TableColumn | null = null
      let bestSimilarity = 0

      for (const col of tableColumns) {
        const similarity = calculateSimilarity(normalizedFileHeader, normalizeColumnName(col.name))
        if (similarity > bestSimilarity && similarity > 0.6) {
          bestSimilarity = similarity
          bestMatch = col
        }
      }

      if (bestMatch) {
        matchedColumn = bestMatch
        confidence = bestSimilarity
      }
    }

    return {
      fileColumn: fileHeader,
      tableColumn: matchedColumn?.name || null,
      confidence,
    }
  })
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1

  if (longer.length === 0) return 1.0

  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
      }
    }
  }

  return matrix[str2.length][str1.length]
}

export function validateMapping(mapping: ColumnMapping[], tableColumns: TableColumn[]): MappingValidation {
  const mappedColumns = mapping.filter((m) => m.tableColumn !== null).map((m) => m.tableColumn)
  const unmappedRequired = tableColumns.filter((col) => col.required && !mappedColumns.includes(col.name))
  const unmappedOptional = tableColumns.filter((col) => !col.required && !mappedColumns.includes(col.name))

  return {
    isValid: unmappedRequired.length === 0,
    unmappedRequired: unmappedRequired.map((col) => col.name),
    unmappedOptional: unmappedOptional.map((col) => col.name),
    mappedCount: mappedColumns.length,
    totalRequired: tableColumns.filter((col) => col.required).length,
    totalColumns: tableColumns.length,
  }
}

export function generateImportSummary(importMappings: ImportMapping[], availableTables: TableSchema[]): ImportSummary {
  const validMappings = importMappings.filter((m) => {
    if (!m.tableName) return false;
    const table = availableTables.find((t) => t.name === m.tableName);
    if (!table) return false;
    const validation = validateMapping(m.columnMappings, table.columns);
    return validation.isValid;
  });

  const mappingDetails = importMappings
      .filter((m) => m.tableName !== null) // Ensure tableName is not null
      .map((m) => {
        const table = availableTables.find((t) => t.name === m.tableName)!;
        const validation = validateMapping(m.columnMappings, table.columns);

        // Determine mapping type
        const autoMapped = m.columnMappings.filter((cm) => cm.confidence && cm.confidence > 0.6).length;
        const manualMapped = m.columnMappings.filter(
            (cm) => cm.tableColumn && (!cm.confidence || cm.confidence <= 0.6),
        ).length;
        let mappingType: "auto" | "manual" | "mixed" = "auto";
        if (manualMapped > 0 && autoMapped > 0) mappingType = "mixed";
        else if (manualMapped > 0) mappingType = "manual";

        return {
          sourceId: m.sourceId,
          sourceName: m.sourceName,
          tableName: m.tableName || "",
          rowCount: m.parsedData.rows.length,
          validation,
          mappingType,
        };
      });

  return {
    totalSources: importMappings.length,
    totalRows: importMappings.reduce((sum, m) => sum + m.parsedData.rows.length, 0),
    validMappings: validMappings.length,
    invalidMappings: importMappings.filter((m) => m.tableName).length - validMappings.length,
    mappingDetails,
  };
}

function normalizeColumnName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim()
}
