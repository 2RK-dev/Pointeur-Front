import {ScheduleItem} from "@/Types/ScheduleItem";

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
export function getWidthPercentageFor(duration: number){
    return (duration / DAY_DURATION) * 100;
}

export function getWidthPercentage(start: Date, end: Date): number {
    const duration = getTimeInMinutes(end) - getTimeInMinutes(start);
    return getWidthPercentageFor(duration);
}

type Week = {
    start: Date
    end: Date
}

export function getNextFourWeeks(): Week[] {
    const weeks: Week[] = []
    const today = new Date()

    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - dayOfWeek + 1)
    monday.setHours(0, 0, 0, 0)

    for (let i = 0; i < 4; i++) {
        const start = new Date(monday)
        start.setDate(monday.getDate() + i * 7)

        const end = new Date(start)
        end.setDate(start.getDate() + 6)

        weeks.push({ start, end })
    }

    return weeks
}

export function getWeekRange(weekIndex: number): { start: Date, end: Date } {
    const weeks = getNextFourWeeks();
    if (weekIndex < 0 || weekIndex >= weeks.length) {
        throw new Error("Invalid week index");
    }
    return weeks[weekIndex];
}

