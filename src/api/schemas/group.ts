import z from "zod";
import { LevelSchema } from "./level";

export const BaseGroupSchema = z.object({
    name: z.string(),
    type: z.string(),
    classe: z.string(),
    size: z.number(),
});

export const GroupSchema = BaseGroupSchema.extend({
    id: z.number(),
    level: LevelSchema
});

export const CreateGroupSchema = BaseGroupSchema;
export const UpdateGroupSchema = BaseGroupSchema;

export const LevelDetailsSchema = z.object({
    level: LevelSchema,
    groups: GroupSchema.array(),
})