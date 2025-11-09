import { IImportMapping, IImportSummary } from "@/api/types";
import { http } from "@/api/http/axios";
import { ImportSummarySchema } from "@/api/schemas/import";

export async function import_ (files: File[], mapping: IImportMapping, overwriteOnConflict: boolean): Promise<IImportSummary> {
    const formData = new FormData();
    const metadataBlob = new Blob([JSON.stringify(mapping)], { type: 'application/json' });
    formData.append("metadata", metadataBlob);
    files.forEach(file => formData.append("files", file));
    const {data: responseData} = await http.pub.postForm(`/import/upload?ignoreConflicts=${!overwriteOnConflict}`, formData);
    return ImportSummarySchema.parse(responseData);
}

export async function export_ (entities: string[], format: string): Promise<Blob> {
    const response = await http.pub.get(
        `/export?format=${format}&entitiesList=${entities.join(",")}`,
        {responseType: "arraybuffer"}
    );
    return new Blob([response.data], {type: response.headers["Content-Type"]?.toString()});
}