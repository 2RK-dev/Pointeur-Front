// noinspection JSUnusedGlobalSymbols

"use server";

import data from "@/test/ScheduleItem.json";
import {ScheduleItem, ScheduleItemPost, ScheduleItemSchema} from "@/Types/ScheduleItem";

export async function getScheduleItems(startTime:Date, endTime:Date): Promise<ScheduleItem[]> {
    const items = ScheduleItemSchema.array().parse(data);
    return items.filter(item => {
        return item.startTime >= startTime && item.endTime <= endTime;
    });
}

export async function addScheduleItemService(scheduleItem : ScheduleItemPost): Promise<ScheduleItem> {
    // This function is a placeholder for adding a schedule item.
    // In a real application, you would implement the logic to add an item to your database or state.
    console.log(scheduleItem);
    throw new Error("Not implemented");
}