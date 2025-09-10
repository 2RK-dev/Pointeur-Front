import z from "zod";

export const LevelSchema = z.object({
    id: z.number(),
    name: z.string(),
    abbreviation: z.string()
});
