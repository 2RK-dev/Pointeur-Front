import z from 'zod';
import {GroupDTOSchema} from "@/Types/GroupDTO";

export const LevelDTOSchema = z.object({
    id: z.number(),
    name: z.string(),
    abr: z.string(),
})

export const LevelPostDTOSchema = LevelDTOSchema.omit({ id: true });

export const LevelDetailSchema = z.object({
    level: LevelDTOSchema,
    groups: z.array(GroupDTOSchema)
})


export type LevelDTO = z.infer<typeof LevelDTOSchema>;
export type LevelPostDTO = z.infer<typeof LevelPostDTOSchema>;
export type LevelDetailsDTO = z.infer<typeof LevelDetailSchema>;