import z from 'zod';
import {GroupDTOSchema} from "@/Types/GroupDTO";

export const LevelSchema = z.object({
    id: z.number(),
    name: z.string(),
    groups: z.array(GroupDTOSchema)
})

export const LevelDetailSchema = z.object({
    level: LevelSchema,
    groups: z.array(GroupDTOSchema)
})

export type Level = z.infer<typeof LevelSchema>;
export type LevelDetail = z.infer<typeof LevelDetailSchema>;