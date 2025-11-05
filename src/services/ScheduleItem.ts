// noinspection JSUnusedGlobalSymbols

"use server";

import { ScheduleItem, ScheduleItemPost, TranspositionResponse } from "@/Types/ScheduleItem";
import {
    createScheduleItem, createScheduleItems,
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
    const requestBody: ICreateScheduleItem = ScheduleItemMapper.iCreateItemFromItemPost(scheduleItem);
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
    };
    const item = await updateScheduleItem(id, requestBody);
    return ScheduleItemMapper.fromDto(item);
}

export async function deleteScheduleItemService (id: number): Promise<number> {
    await deleteScheduleItem(id);
    return id;
}

export async function AddScheduleItemListService (scheduleItemList: ScheduleItemPost[]): Promise<TranspositionResponse> {
    const requestBody: ICreateScheduleItem[] = scheduleItemList.map(ScheduleItemMapper.iCreateItemFromItemPost);
    const bulkCreationResponse = await createScheduleItems(requestBody);
    return {
        successItems: bulkCreationResponse.successItems.map(ScheduleItemMapper.fromDto),
        failedItems: bulkCreationResponse.failedItems.map(failed => ({
            item: ScheduleItemMapper.itemPostFromICreateItem(failed.item),
            reason: failed.reason
        })),
    }
}