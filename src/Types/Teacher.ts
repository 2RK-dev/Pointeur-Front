import z from 'zod'

export const TeacherSchema = z.object({
    id: z.number(),
    name: z.string(),
    abr: z.string()
})

export type Teacher = z.infer<typeof TeacherSchema>