import z from 'zod'

export const GroupDTOSchema = z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
    classe: z.string(),
    size: z.number().int().positive(),
    levelName: z.string(),
    levelId: z.number(),
})

export type GroupDTO = z.infer<typeof GroupDTOSchema>