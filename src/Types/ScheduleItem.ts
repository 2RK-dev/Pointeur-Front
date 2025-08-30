import z from 'zod';
import {TeacherSchema} from "@/Types/Teacher";
import {TeachingUnitSchema} from "@/Types/TeachingUnit";
import {RoomSchema} from "@/Types/Room";
import {GroupSchema} from "@/Types/Group";

export const ScheduleItemSchema = z.object({
  id: z.number(),
  startTime: z.preprocess((arg) => new Date(arg as string), z.date()),
  endTime: z.preprocess((arg) => new Date(arg as string), z.date()),
  Teacher: TeacherSchema,
  TeachingUnit: TeachingUnitSchema,
  Room: RoomSchema,
  Groups: z.array(GroupSchema)
});

export const ScheduleItemPostSchema = z.object({
    startTime: z.preprocess((arg) => (arg as Date).toISOString().slice(0, 19), z.string()),
    endTime: z.preprocess((arg) => (arg as Date).toISOString().slice(0, 19), z.string()),
    TeacherId: z.number(),
    TeachingUnitID: z.number(),
    RoomId: z.number(),
    GroupIds: z.array(z.string())
})


export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;
export type ScheduleItemPost = z.infer<typeof ScheduleItemPostSchema>;