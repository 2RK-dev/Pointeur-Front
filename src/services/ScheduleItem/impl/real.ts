// noinspection JSUnusedGlobalSymbols

"use server";

import { ScheduleItem } from "@/Types/ScheduleItem";
import { fetchScheduleItemsForLevel } from "@/api/http/schedule-item";

export async function getScheduleItemsByLevel(LevelId: number): Promise<ScheduleItem[]> {
    try {
        const scheduleItemList = await fetchScheduleItemsForLevel(LevelId);
        return scheduleItemList.map(item => ({
            id: item.id,
            startTime: item.startTime,
            endTime: item.endTime,
            Teacher: {
                id: item.teacher.id,
                name: item.teacher.name,
                abr: item.teacher.abbreviation
            },
            TeachingUnit: {
                id: item.teachingUnit.id,
                abr: item.teachingUnit.abbreviation,
                name: item.teachingUnit.name
            },
            Room: {
                id: item.room.id,
                abr: item.room.abbreviation,
                name: item.room.name,
                capacity: item.room.size
            },
            Groups: item.groups.map(({id, name, size}) => ({
                id: id, abr: name, name: name, size: size
            }))
        }))
    } catch (error) {
        console.error("Error loading schedule items for the given level:", error);
        return [];
    }
}