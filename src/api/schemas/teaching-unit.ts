import z from "zod";
import { LevelSchema } from "@/api/schemas/level";

const BaseTeachingUnitSchema = z.object({
    abbreviation: z.string(),
    name: z.string(),
    levelId: z.number().nullable()
});
export const TeachingUnitSchema = BaseTeachingUnitSchema
    .omit({levelId: true})
    .extend({level: LevelSchema.nullable(), id: z.number()});
export const CreateTeachingUnitSchema = BaseTeachingUnitSchema;
export const UpdateTeachingUnitSchema = BaseTeachingUnitSchema;