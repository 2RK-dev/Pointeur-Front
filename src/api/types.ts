import z from "zod";
import { GroupSchema, LevelDetailsSchema } from "./schemas/group";
import { CreateRoomSchema, RoomSchema, UpdateRoomSchema } from "./schemas/room";
import { CreateScheduleItemSchema, ScheduleItemSchema } from "./schemas/schedule-item";
import { TeacherSchema } from "./schemas/teacher";
import { TeachingUnitSchema } from "./schemas/teaching-unit";

export type IGroup = z.infer<typeof GroupSchema>;
export type IRoom = z.infer<typeof RoomSchema>;
export type IScheduleItem = z.infer<typeof ScheduleItemSchema>;
export type ITeacher = z.infer<typeof TeacherSchema>;
export type ITeachingUnit = z.infer<typeof TeachingUnitSchema>;
export type ICreateScheduleItem = z.infer<typeof CreateScheduleItemSchema>;
export type ILevelDetails = z.infer<typeof LevelDetailsSchema>;
export type ICreateRoom = z.infer<typeof CreateRoomSchema>;
export type IUpdateRoom = z.infer<typeof UpdateRoomSchema>;
export type IUpdateScheduleItem = z.infer<typeof UpdateScheduleItemSchema>;