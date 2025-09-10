import z from "zod";

export const RoomSchema = z.object({
    id: z.number(),
    name: z.string(),
    abbreviation: z.string(),
    size: z.number(),
})