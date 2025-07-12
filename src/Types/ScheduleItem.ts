import z from 'zod';
import {TeacherSchema} from "@/Types/Teacher";
import {TeachingUnitSchema} from "@/Types/TeachingUnit";
import {RoomSchema} from "@/Types/Room";
import {GroupSchema} from "@/Types/Group";

export const ScheduleItemSchema = z.object({
  id: z.number(),
  startTime: z.date().transform((val) => new Date(val)),
  endTime: z.date().transform((val) => new Date(val)),
  Teacher: TeacherSchema,
  TeachingUnit: TeachingUnitSchema,
  Room: RoomSchema,
  Groups: z.array(GroupSchema)
});

export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;