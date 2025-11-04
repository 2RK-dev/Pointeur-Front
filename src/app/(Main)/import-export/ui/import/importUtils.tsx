import {FileJson, FileSpreadsheet, FileText} from "lucide-react";

export type FileType = "csv" | "excel" | "json"

export const fileType: FileType[] = ["csv", "excel", "json"]

export const getFileIcon = (type: FileType) => {
    if (type === "json") return <FileJson className="h-4 w-4"/>
    if (type === "csv") return <FileText className="h-4 w-4"/>
    return <FileSpreadsheet className="h-4 w-4"/>
}