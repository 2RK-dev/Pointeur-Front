import { z } from "zod"

export const SuccessItemSchema = z.record(z.any())
export const FailedItemSchema = z.object({
    item: z.any(),
    reason: z.string(),
})

export const ResultImportSchema = z.object({
    success: z.array(SuccessItemSchema),
    failed: z.array(FailedItemSchema),
})

export type SuccessItem = z.infer<typeof SuccessItemSchema>
export type FailedItem = z.infer<typeof FailedItemSchema>
export type ResultImport = z.infer<typeof ResultImportSchema>

