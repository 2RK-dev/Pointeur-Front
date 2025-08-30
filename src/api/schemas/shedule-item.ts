import z from "zod";
import { GroupSchema } from "@/api/schemas/group";
import { RoomSchema } from "@/api/schemas/room";
import { TeachingUnitSchema } from "@/api/schemas/teaching-unit";
import { TeacherSchema } from "@/api/schemas/teacher";

export const ScheduleItemSchema = z.object({
    id: z.number(),
    groups: GroupSchema.array(),
    teacher: TeacherSchema,
    teachingUnit: TeachingUnitSchema,
    room: RoomSchema,
    startTime: z.date(),
    endTime: z.date(),
})