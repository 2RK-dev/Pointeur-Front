import z from 'zod'

export const GroupSchema = z.object({
    id: z.number(),
    name: z.string(),
    abr: z.string(),
    size: z.number().int().positive(),
    levelName: z.string(),
    levelId: z.number(),
})

export type Group = z.infer<typeof GroupSchema>