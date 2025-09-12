import { ICreateScheduleItem, IScheduleItem } from "@/api/types";
import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";

export async function fetchScheduleItemsForLevel (
    start: Date = new Date(1997, 1, 1, 0, 0, 0, 0),
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