// noinspection JSUnusedGlobalSymbols

"use server";

import { ScheduleItem, ScheduleItemPost } from "@/Types/ScheduleItem";
import { createScheduleItem, fetchScheduleItemsForLevel } from "@/api/http/schedule-item";
import { ICreateScheduleItem } from "@/api/types";
import { ScheduleItemMapper } from "@/services/mapper";

export async function getScheduleItems (startTime: Date, endTime: Date): Promise<ScheduleItem[]> {
    try {
        const scheduleItemList = await fetchScheduleItemsForLevel(startTime, endTime);
        return scheduleItemList.map(item => ScheduleItemMapper.fromDto(item));
    } catch (error) {
        console.error("Error loading schedule items for the given level:", error);
        return [];
    }
}

export async function addScheduleItemService (scheduleItem: ScheduleItemPost): Promise<ScheduleItem> {
    const requestBody: ICreateScheduleItem = {
        startTime: scheduleItem.startTime,
        endTime: scheduleItem.endTime,
        groupIds: scheduleItem.GroupIds.map(s => parseInt(s)),
        teacherId: scheduleItem.TeacherId,
        teachingUnitId: scheduleItem.TeachingUnitID,
        roomId: scheduleItem.RoomId
    };
    const item = await createScheduleItem(requestBody);
    return ScheduleItemMapper.fromDto(item);
}