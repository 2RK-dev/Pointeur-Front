import z from "zod";

const BaseTeacherSchema = z.object({
    name: z.string(),
    abbreviation: z.string(),
});
export const TeacherSchema = BaseTeacherSchema.extend({id: z.number()});
export const CreateTeacherSchema = BaseTeacherSchema;
export const UpdateTeacherSchema = BaseTeacherSchema;