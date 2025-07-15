import z from 'zod'

export const RoomSchema = z.object({
    id: z.number(),
    name: z.string(),
    abr: z.string(),
    capacity: z.number().int().positive()
})

export type Room = z.infer<typeof RoomSchema>