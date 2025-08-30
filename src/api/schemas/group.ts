import z from "zod";
import { LevelSchema } from "./level";

export const GroupSchema = z.object({
    id: z.number(),
    name: z.string(),
    size: z.number(),
    level: LevelSchema
});