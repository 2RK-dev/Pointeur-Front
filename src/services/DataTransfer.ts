"use server"

import { FileSource, ImportMapping } from "@/lib/types";
import { ResultImport } from "@/Types/glob";
import { IImportMapping } from "@/api/types";
import { export_, import_ } from "@/api/http/data-transfer";
import { ImportMapper } from "@/services/mapper";
import { dashesCamelCase } from "next/dist/build/webpack/loaders/css-loader/src/utils";


export async function importData(file:FileSource[], mapping:ImportMapping[], isDeleteOldData:boolean):Promise<ResultImport> {
    const importMapping: IImportMapping = ImportMapper.parseMapping(mapping);

    const importSummary = await import_(
        file.map(f => f.file),
        importMapping,
        isDeleteOldData
    );

    console.log(importSummary);

    return {
        failed: importSummary.errors.map(e => ({
            item: e.invalidValue,
            reason: e.errorMessage
        })),
        success: Array(importSummary.successfulRows).fill({}),
    };
}

export async function exportData(tables:string[], format:string):Promise<Blob> {
    if (format == "csv") format = "zip_csv";
    tables = tables.map(dashesCamelCase);
    return await export_(tables, format);
}