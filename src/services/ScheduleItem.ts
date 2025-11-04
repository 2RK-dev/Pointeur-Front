// noinspection JSUnusedGlobalSymbols

"use server";

import { ScheduleItem, ScheduleItemPost } from "@/Types/ScheduleItem";
import {
    createScheduleItem,
    deleteScheduleItem,
    fetchScheduleItemsForLevel,
    updateScheduleItem
} from "@/api/http/schedule-item";
import { ICreateScheduleItem, IUpdateScheduleItem } from "@/api/types";
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
        groupIds: scheduleItem.GroupIds.map(s => parseInt(s, 10)),
        teacherId: scheduleItem.TeacherId,
        teachingUnitId: scheduleItem.TeachingUnitID,
        roomId: scheduleItem.RoomId
    };
    const item = await createScheduleItem(requestBody);
    return ScheduleItemMapper.fromDto(item);
}

export async function updateScheduleItemService (id: number, scheduleItem: ScheduleItemPost): Promise<ScheduleItem> {
    const requestBody: IUpdateScheduleItem = {
        endTime: scheduleItem.endTime,
        startTime: scheduleItem.startTime,
        groupIds: scheduleItem.GroupIds.map(s => parseInt(s, 10)),
        roomId: scheduleItem.RoomId,
        teacherId: scheduleItem.TeacherId,
        teachingUnitId: scheduleItem.TeachingUnitID
    }
    const item = await updateScheduleItem(id, requestBody);
    return ScheduleItemMapper.fromDto(item);
}

export async function deleteScheduleItemService (id: number): Promise<number> {
    await deleteScheduleItem(id);
    return id;
}

export async function AddScheduleItemListService (): Promise<ScheduleItem[]> {
    //TODO: Implement transpose logic here
    throw new Error("Not implemented");
}