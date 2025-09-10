import { ScheduleItem, ScheduleItemPost } from "@/Types/ScheduleItem";

/**
 * Schedule Service Type Definition.
 * This interface defines the functions to be exported by all the Schedule Service implementations.
 * Services should only export functions.
 */
export type IScheduleItemService = {
    getScheduleItems(startTime:Date, endTime:Date): Promise<ScheduleItem[]>,
    addScheduleItemService (scheduleItem: ScheduleItemPost): Promise<ScheduleItem>;
}