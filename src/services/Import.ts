"use server"

import {FileSource, ImportMapping} from "@/lib/types";
import {ResultImport} from "@/Types/glob";


export async function importData(file:FileSource[], mapping:ImportMapping[]):Promise<ResultImport> {
    //TODO: Implement data import logic
    throw new Error("Not implemented")
}