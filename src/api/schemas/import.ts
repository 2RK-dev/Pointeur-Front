import z from "zod";

export const SyncErrorSchema = z.object({
    entityType: z.string(),
    rowIndex: z.number(),
    errorMessage: z.string(),
    invalidValue: z.string(),
});

export const ImportSummarySchema = z.object({
    totalRows: z.number(),
    successfulRows: z.number(),
    failedRows: z.number(),
    errors: z.array(SyncErrorSchema),
    skippedFiles: z.array(z.string()),
    entitySummary: z.record(z.number()),
});
