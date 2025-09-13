import z from "zod";

export const RoomSchema = z.object({
    id: z.number(),
    name: z.string(),
    abbreviation: z.string(),
    size: z.number(),
});

export const CreateRoomSchema = z.object({
    name: z.string(),
    abbreviation: z.string(),
    size: z.number(),
});

export const UpdateRoomSchema = z.object({
    name: z.string(),
    abbreviation: z.string(),
    size: z.number()
});