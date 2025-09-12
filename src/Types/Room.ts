import z from 'zod'

export const RoomSchema = z.object({
    id: z.number(),
    name: z.string(),
    abr: z.string(),
    capacity: z.number().int().positive()
})

export const RoomPostSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    abr: z.string().min(1, "L'abréviation est requise"),
    capacity: z.number({
        required_error: "La capacité est requise",
    }).min(0, "La capacité doit être positive").int()
})

export type Room = z.infer<typeof RoomSchema>
export type RoomPost = z.infer<typeof RoomPostSchema>