import z from 'zod';
import {GroupSchema} from "@/Types/Group";

export const LevelSchema = z.object({
    id: z.number(),
    name: z.string(),
    groups: z.array(GroupSchema)
})

export type Level = z.infer<typeof LevelSchema>;