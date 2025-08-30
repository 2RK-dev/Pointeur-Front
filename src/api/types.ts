import z from "zod";
import { LevelSchema } from "./schemas/level";
import { GroupSchema } from "./schemas/group";
import { RoomSchema } from "./schemas/room";
import { ScheduleItemSchema } from "./schemas/shedule-item";
import { TeacherSchema } from "./schemas/teacher";
import { TeachingUnitSchema } from "./schemas/teaching-unit";

export type ILevel = z.infer<typeof LevelSchema>;
export type IGroup = z.infer<typeof GroupSchema>;
export type IRoom = z.infer<typeof RoomSchema>;
export type IScheduleItem = z.infer<typeof ScheduleItemSchema>;
export type ITeacher = z.infer<typeof TeacherSchema>;
export type ITeachingUnit = z.infer<typeof TeachingUnitSchema>;