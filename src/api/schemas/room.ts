import z from "zod";

const BaseRoomSchema = z.object({
    name: z.string(),
    abbreviation: z.string(),
    size: z.number(),
});

export const RoomSchema = BaseRoomSchema.extend({
    id: z.number(),
});
export const CreateRoomSchema = BaseRoomSchema;
export const UpdateRoomSchema = BaseRoomSchema;