"use server"

import {FileSource, ImportMapping} from "@/lib/types";
import {ResultImport} from "@/Types/glob";


export async function importData(file:FileSource[], mapping:ImportMapping[], isDeleteOldData:boolean):Promise<ResultImport> {
    //TODO: Implement data import logic
    throw new Error("Not implemented")
}

export async function exportData(tables:string[], format:string):Promise<Blob> {
    //TODO: Implement data export logic
    throw new Error("Not implemented")
}