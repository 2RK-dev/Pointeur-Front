import z from 'zod';
import {TeacherSchema} from "@/Types/Teacher";
import {TeachingUnitSchema} from "@/Types/TeachingUnit";
import {RoomSchema} from "@/Types/Room";
import {GroupSchema} from "@/Types/Group";

export const ScheduleItemSchema = z.object({
  id: z.number(),
  startTime: z.date(),
  endTime: z.date(),
  Teacher: TeacherSchema,
  TeachingUnit: TeachingUnitSchema,
  Room: RoomSchema,
  Groups: z.array(GroupSchema)
});

export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;