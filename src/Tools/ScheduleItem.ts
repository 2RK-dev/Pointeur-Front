import {ScheduleItem, ScheduleItemPost, ScheduleItemPostSchema, Week} from "@/Types/ScheduleItem";

const DAY_START_MINUTES = 7 * 60;
const DAY_END_MINUTES = 18 * 60;
const DAY_DURATION = DAY_END_MINUTES - DAY_START_MINUTES;

export const DAYS: string[] = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
];

export const generateHours = () => {
    const hours = []
    for (let i = 7; i <= 18; i++) {
        hours.push(`${i.toString().padStart(2, "0")}:00`)
        if (i < 18) {
            hours.push(`${i.toString().padStart(2, "0")}:30`)
        }
    }
    return hours
}

function isOverlapping(a: ScheduleItem, b: ScheduleItem): boolean {
    return a.startTime < b.endTime && b.startTime < a.endTime;
}

export function calculateRowAssignments(scheduleItems: ScheduleItem[]) {
    const rows: ScheduleItem[][] = [];

    const sorted = [...scheduleItems].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    for (const sortedScheduleItem of sorted) {
        let placed = false;

        for (const row of rows) {
            const hasOverlap = row.some(existing => isOverlapping(existing, sortedScheduleItem));
            if (!hasOverlap) {
                row.push(sortedScheduleItem);
                placed = true;
                break;
            }
        }

        if (!placed) {
            rows.push([sortedScheduleItem]);
        }
    }

    return rows;
}

function getTimeInMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
}

/**
 * Calculates the width percentage for a given duration in minutes.
 *
 * @param {number} duration - The duration in minutes.
 * @returns {number} The width percentage as a proportion of the total day duration.
 */
export function getWidthPercentageFor(duration: number): number {
    return (duration / DAY_DURATION) * 100;
}

export function getWidthPercentage(start: Date, end: Date): number {
    const duration = getTimeInMinutes(end) - getTimeInMinutes(start);
    return getWidthPercentageFor(duration);
}

/**
 * Get all next weeks from a given date (including the week of the given date).
 *
 * @param numberOfWeeks Number of weeks to get
 * @param startFrom date to start from
 * @returns Array of Week objects
 */
export function getAllNextWeeksFromDate(numberOfWeeks: number, startFrom: Date = new Date()): Week[] {
    const weeks: Week[] = []
    const dayOfWeek = startFrom.getDay() === 0 ? 7 : startFrom.getDay()
    const monday = new Date(startFrom)
    monday.setDate(startFrom.getDate() - dayOfWeek + 1)
    monday.setHours(0, 0, 0, 0)
    for (let i = 0; i < numberOfWeeks; i++) {
        const start = new Date(monday)
        start.setDate(monday.getDate() + i * 7)

        const end = new Date(start)
        end.setDate(start.getDate() + 6)

        weeks.push({start, end})
    }
    return weeks
}

/**
 * Calculates the diference in weeks between two dates.
 * @param {Date} date1 - The first date.
 * @param {Date} date2 - The second date.
 * @returns {number} The number of weeks between the two dates.
 */
export function getWeekDifference(date1: Date, date2: Date): number {
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const diffInMilliseconds = date2.getTime() - date1.getTime();
    return Math.floor(diffInMilliseconds / millisecondsPerWeek);
}

/**
 Adds the specified number of weeks to the date fields of each selected ScheduleItem.

 For example, if an item has a startTime of "2024-06-01" and weeksToAdd is 2,
 its new startTime will be "2024-06-15".

 @param {ScheduleItem[]} items - The selected schedule items to update.
 @param {number} weeksToAdd - The number of weeks to add to each item's date.
 @returns {ScheduleItem[]} The updated schedule items with new dates.
 */
export function AddWeeksToScheduleItems(items: ScheduleItem[], weeksToAdd: number): ScheduleItem[] {
    return items.map(item => {
        const newStartTime = new Date(item.startTime);
        newStartTime.setDate(newStartTime.getDate() + weeksToAdd * 7);

        const newEndTime = new Date(item.endTime);
        newEndTime.setDate(newEndTime.getDate() + weeksToAdd * 7);

        return {
            ...item,
            startTime: newStartTime,
            endTime: newEndTime
        };
    });
}


/**
 * Converts a `ScheduleItem` to a `ScheduleItemPost`-compliant object.
 *
 * - Maps date fields and relations (teacher, teaching unit, room, groups).
 * - Formats `GroupIds` as an array of strings.
 * - Validates and normalizes the result via `ScheduleItemPostSchema.parse` to ensure
 *   the payload matches the API schema.
 *
 * @param {ScheduleItem} item - The schedule item to convert.
 * @returns {ScheduleItemPost} Validated object ready to be sent to the backend.
 */
export function ScheduleItemToPost(item: ScheduleItem): ScheduleItemPost {
    return ScheduleItemPostSchema.parse({
        startTime: item.startTime,
        endTime: item.endTime,
        TeacherId: item.Teacher.id,
        TeachingUnitID: item.TeachingUnit.id,
        RoomId: item.Room ? item.Room.id : null,
        GroupIds: item.Groups.map(g => g.id.toString())
    })
}


