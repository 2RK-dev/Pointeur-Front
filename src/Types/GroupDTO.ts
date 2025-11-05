import z from 'zod'

export const GroupDTOSchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Le nom du groupe est requis"),
    type: z.string().min(1, "Le nom du groupe est requis"),
    classe: z.string().min(1, "Le nom du groupe est requis"),
    size: z.number().int().positive(),
    levelAbr: z.string(),
    levelId: z.number(),
})

export const GroupPostDTOSchema = GroupDTOSchema.omit({ id: true , levelAbr: true, levelId: true})

export type GroupDTO = z.infer<typeof GroupDTOSchema>
export type GroupPost = z.infer<typeof GroupPostDTOSchema>