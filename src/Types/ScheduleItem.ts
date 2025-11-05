import z from 'zod';
import {TeacherSchema} from "@/Types/Teacher";
import {TeachingUnitSchema} from "@/Types/TeachingUnit";
import {RoomSchema} from "@/Types/Room";
import {GroupDTOSchema} from "@/Types/GroupDTO";

export const ScheduleItemSchema = z.object({
  id: z.number(),
  startTime: z.preprocess((arg) => new Date(arg as string), z.date()),
  endTime: z.preprocess((arg) => new Date(arg as string), z.date()),
  Teacher: TeacherSchema,
  TeachingUnit: TeachingUnitSchema,
  Room: RoomSchema.nullable(),
  Groups: z.array(GroupDTOSchema)
});

export const ScheduleItemPostSchema = z.object({
    startTime: z.preprocess((arg) => (arg as Date).toISOString(), z.string()),
    endTime: z.preprocess((arg) => (arg as Date).toISOString(), z.string()),
    TeacherId: z.number(),
    TeachingUnitID: z.number(),
    RoomId: z.number().nullable(),
    GroupIds: z.array(z.string())
})

export const WeekSchema = z.object({
    start: z.preprocess((arg) => new Date(arg as string), z.date()),
    end: z.preprocess((arg) => new Date(arg as string), z.date()),
});

export const TranspositionResponseSchema = z.object({
    successItems: z.array(ScheduleItemSchema),
    failedItems: z.array(z.object({
        item: ScheduleItemPostSchema,
        reason: z.string()
    }))
})


export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;
export type ScheduleItemPost = z.infer<typeof ScheduleItemPostSchema>;
export type Week = z.infer<typeof WeekSchema>;
export type TranspositionResponse = z.infer<typeof TranspositionResponseSchema>;