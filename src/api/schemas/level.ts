import z from "zod";

const BaseLevelSchema = z.object({
    name: z.string(),
    abbreviation: z.string()
});

export const LevelSchema = BaseLevelSchema.extend({
    id: z.number(),
});

export const CreateLevelSchema = BaseLevelSchema;
export const UpdateLevelSchema = BaseLevelSchema;