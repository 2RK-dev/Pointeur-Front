import { IScheduleItem } from "@/api/types";
import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";

export async function fetchScheduleItemsForLevel (
    levelId: number,
    start: Date = new Date(1997, 1, 1, 0, 0, 0, 0),
    end: Date = new Date()
): Promise<IScheduleItem[]> {

    const {data: responseData} = await http.pub.get(`/schedule?startDate=${start}&endDate=${end}&levelId=${levelId}`);
    return DTO.ScheduleItemSchema.array().parse(responseData);
}