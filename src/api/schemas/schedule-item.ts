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
    startTime: z.string().datetime({local: true}),
    endTime: z.string().datetime({local: true}),
});

export const CreateScheduleItemSchema = z.object({
    groupIds: z.number().array(),
    teacherId: z.number(),
    teachingUnitId: z.number(),
    roomId: z.number(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
});

export const UpdateScheduleItemSchema = z.object({
    groupIds: z.number().array(),
    teacherId: z.number(),
    teachingUnitId: z.number(),
    roomId: z.number(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
});