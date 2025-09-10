import z from "zod";
import { LevelSchema } from "@/api/schemas/level";

export const TeachingUnitSchema = z.object({
    id: z.number(),
    abbreviation: z.string(),
    name: z.string(),
    level: LevelSchema,
});