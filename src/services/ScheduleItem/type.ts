import { ScheduleItem } from "@/Types/ScheduleItem";

/**
 * Schedule Service Type Definition.
 * This interface defines the functions to be exported by all the Schedule Service implementations.
 * Services should only export functions.
 */
export type IScheduleItemService = {
    getScheduleItemsByLevel(LevelId: number): Promise<ScheduleItem[]>,
}