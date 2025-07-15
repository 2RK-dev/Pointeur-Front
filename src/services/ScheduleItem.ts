"use server";

import data from "@/test/ScheduleItem.json";
import {getGroupInLevel} from "@/services/Level";
import {ScheduleItem, ScheduleItemSchema} from "@/Types/ScheduleItem";

export async function getScheduleItemsByLevel(LevelId: number): Promise<ScheduleItem[]> {
    try {
        const useData = ScheduleItemSchema.array().parse(data);
        const groups = await getGroupInLevel(LevelId);
        return useData.filter((item) =>
            item.Groups.some((group) =>
                groups.some((g) => g.id === group.id)));
    } catch (error) {
        console.error("Error loading schedule items for the given level:", error);
        return [];
    }
}