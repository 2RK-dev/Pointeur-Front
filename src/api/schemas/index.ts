import { LevelSchema } from "./level";
import { GroupSchema, LevelDetailsSchema } from "./group";
import { RoomSchema } from "./room";
import { BulkScheduleItemCreationResponseSchema, CreateScheduleItemSchema, ScheduleItemSchema } from "./schedule-item";
import { TeacherSchema } from "./teacher";
import { TeachingUnitSchema } from "./teaching-unit";
import { LoginResponseSchema } from "@/api/schemas/auth";
import { ImportSummarySchema } from "@/api/schemas/import";

export const DTO = {
    CreateScheduleItemSchema,
    GroupSchema,
    LevelDetailsSchema,
    LevelSchema,
    RoomSchema,
    ScheduleItemSchema,
    TeacherSchema,
    TeachingUnitSchema,
    BulkScheduleItemCreationResponseSchema,
    LoginResponseSchema,
    ImportSummarySchema,
}