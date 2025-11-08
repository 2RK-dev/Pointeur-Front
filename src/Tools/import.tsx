import {FileJson, FileSpreadsheet, FileText} from "lucide-react";
import type {TableSchema} from "@/lib/types";

export type FileType = "csv" | "excel" | "json"

export const fileType: FileType[] = ["csv", "excel", "json"]

export const getFileIcon = (type: FileType) => {
    if (type === "json") return <FileJson className="h-4 w-4"/>
    if (type === "csv") return <FileText className="h-4 w-4"/>
    return <FileSpreadsheet className="h-4 w-4"/>
}

export const AVAILABLE_TABLES: TableSchema[] = [
    {
        name: "level",
        label: "Niveaux d’enseignement",
        columns: [
            { name: "Id", type: "number" },
            { name: "name", type: "string" },
            { name: "abbreviation", type: "string" },
        ]
    },
    {
        name: "groups",
        label: "Groupes d’étudiants",
        columns: [
            { name: "Id", type: "number" },
            { name: "levelId", type: "number" },
            { name: "name", type: "string" },
            { name: "size", type: "number" },
            { name: "type", type: "string" },
            { name: "classe", type: "string" },
        ]
    },
    {
        name: "room",
        label: "Salles de classe",
        columns: [
            { name: "Id", type: "number" },
            { name: "name", type: "string" },
            { name: "size", type: "number" },
            { name: "abbreviation", type: "string" },
        ]
    },
    {
        name: "teacher",
        label: "Enseignants",
        columns: [
            { name: "Id", type: "number" },
            { name: "name", type: "string" },
            { name: "abbreviation", type: "string" },
        ]
    },
    {
        name: "teachingUnit",
        label: "Unités d’enseignement",
        columns: [
            { name: "Id", type: "number" },
            { name: "levelId", type: "number" },
            { name: "name", type: "string" },
            { name: "abbreviation", type: "string" },
        ]
    }
]