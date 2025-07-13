import {Group} from "@/Types/Group";
import {ScheduleItem} from "@/Types/ScheduleItem";

export function getAvailableGroups(scheduleItems:ScheduleItem[], currentGroups:Group[], startTime:Date, endTime:Date,): Group[] {
    const availableGroups: Group[] = [];

    for (const group of currentGroups) {
        const isAvailable = scheduleItems.every(item => {
            return !item.Groups.some(g => g.id === group.id) &&
                (item.startTime >= endTime || item.endTime <= startTime);
        });

        if (isAvailable) {
            availableGroups.push(group);
        }
    }

    return availableGroups;
}
