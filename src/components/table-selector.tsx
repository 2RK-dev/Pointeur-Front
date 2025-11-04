"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Table2, ChevronRight } from "lucide-react"
import type { TableSchema } from "@/lib/mock-tables"

interface TableSelectorProps {
  tables: TableSchema[]
  selectedTables: string[]
  onSelectionChange: (tables: string[]) => void
}

export function TableSelector({ tables, selectedTables, onSelectionChange }: TableSelectorProps) {
  const handleToggle = (tableName: string) => {
    if (selectedTables.includes(tableName)) {
      onSelectionChange(selectedTables.filter((t) => t !== tableName))
    } else {
      onSelectionChange([...selectedTables, tableName])
    }
  }

  const handleSelectAll = () => {
    if (selectedTables.length === tables.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(tables.map((t) => t.name))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sélectionner les tables</h3>
        <button onClick={handleSelectAll} className="text-sm text-primary hover:underline">
          {selectedTables.length === tables.length ? "Tout désélectionner" : "Tout sélectionner"}
        </button>
      </div>

      <div className="grid gap-3">
        {tables.map((table) => {
          const isSelected = selectedTables.includes(table.name)
          return (
            <Card
              key={table.name}
              className={`p-4 cursor-pointer transition-all hover:border-primary ${
                isSelected ? "border-primary bg-accent" : ""
              }`}
              onClick={() => handleToggle(table.name)}
            >
              <div className="flex items-start gap-3">
                <Checkbox checked={isSelected} onCheckedChange={() => handleToggle(table.name)} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Table2 className="h-4 w-4 text-primary" />
                    <Label className="font-semibold cursor-pointer">{table.displayName}</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">{table.columns.length} colonnes</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {table.columns.slice(0, 5).map((col) => (
                      <span key={col.name} className="text-xs bg-secondary px-2 py-1 rounded">
                        {col.name}
                      </span>
                    ))}
                    {table.columns.length > 5 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{table.columns.length - 5} autres
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && <ChevronRight className="h-5 w-5 text-primary" />}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
