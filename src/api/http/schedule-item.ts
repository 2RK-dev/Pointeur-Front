import { ICreateScheduleItem, IScheduleItem } from "@/api/types";
import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";

// Earliest supported schedule date. Used as a default to fetch all items if no start date is provided.
const DEFAULT_SCHEDULE_START_DATE = new Date(1997, 1, 1, 0, 0, 0, 0);

export async function fetchScheduleItemsForLevel (
    start: Date = DEFAULT_SCHEDULE_START_DATE,
    end: Date = new Date(),
    levelId?: number,
): Promise<IScheduleItem[]> {

    let url = `/schedule?startDate=${(start.toISOString())}&endDate=${(end.toISOString())}`;
    if (levelId) url += `&levelId=${levelId}`;
    const {data: responseData} = await http.pub.get(url);
    return DTO.ScheduleItemSchema.array().parse(responseData);
}

export async function createScheduleItem (data: ICreateScheduleItem): Promise<IScheduleItem> {
    const {data: responseData} = await http.pub.post(`/schedule`, data);
    return DTO.ScheduleItemSchema.parse(responseData);
}