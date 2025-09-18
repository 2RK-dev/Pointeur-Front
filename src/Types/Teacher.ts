import z from 'zod'


export const TeacherPostSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    abr: z.string().min(1, "L'abréviation est requise")
})
export const TeacherSchema = TeacherPostSchema.extend({
    id: z.number()
})

export type Teacher = z.infer<typeof TeacherSchema>
export type TeacherPost = z.infer<typeof TeacherPostSchema>