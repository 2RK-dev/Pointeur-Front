import {Group} from "@/Types/Group";
import {ScheduleItem} from "@/Types/ScheduleItem";

export function getAvailableGroups(scheduleItems: ScheduleItem[], currentGroups: Group[], startTime: Date, endTime: Date,): Group[] {
    const overlappingItems = scheduleItems.filter(item => {
        return item.startTime < endTime && item.endTime > startTime;
    });

    const busyGroupIds = new Set<number>();
    for (const item of overlappingItems) {
        for (const group of item.Groups) {
            busyGroupIds.add(group.id);
        }
    }

    return currentGroups.filter(group => !busyGroupIds.has(group.id));
}
