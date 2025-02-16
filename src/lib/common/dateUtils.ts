export interface DayOption {
	date: string;
	label: string;
}

export const days: string[] = [
	"Dimanche",
	"Lundi",
	"Mardi",
	"Mercredi",
	"Jeudi",
	"Vendredi",
	"Samedi",
];

/**
 * Returns the current week number of the year.
 * @param year
 * @returns {number}
 * @example getCurrentWeekNumber() => 6
 * @see https://weeknumber.net/how-to/determine-week-numbers
 */
export function getCurrentWeekNumber(year: number): number {
	const today = new Date();
	const firstDayOfYear = new Date(year, 0, 1);
	const pastDaysOfYear =
		(today.getTime() - firstDayOfYear.getTime()) / 86400000;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Returns the week number of a given date.
 * @param dateString
 * @returns {number}
 * @example getWeekNumber("2025-02-03") => 6
 * @see https://weeknumber.net/how-to/determine-week-numbers
 * */
export function getWeekNumber(dateString: string): number {
	const date = new Date(dateString);
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Returns the start and end dates of a week based on its number and year.
 * @param weekNumber
 * @param year
 * @returns {start: string, end: string}
 * @example getWeekDateRange(1, 2025) => {start: "2024-12-30", end: "2025-01-05"}
 */
export function getWeekDateRange(
	weekNumber: number,
	year: number
): { start: string; end: string } {
	const firstDayOfYear = new Date(year, 0, 1);
	const daysOffset = (weekNumber - 1) * 7;
	const weekStart = new Date(
		firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000
	);

	const dayOfWeek = weekStart.getDay(); // 0 (dimanche) à 6 (samedi)
	const startDate = new Date(weekStart);
	startDate.setDate(
		weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
	);

	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 6); // Fin de semaine (dimanche)

	return {
		start: startDate.toISOString().split("T")[0], // Format YYYY-MM-DD
		end: endDate.toISOString().split("T")[0],
	};
}

/**
 * Returns the day number of a given date.
 * @param dateString
 * @returns {number}
 * @example getDayNumber("2025-02-03") => 1
 * */
export function getDayNumber(dateString: string): number {
	const date = new Date(dateString);
	return date.getDay();
}

/**
 * get date by week and day number
 * @param year
 * @param week
 * @param day
 * @returns {string}
 * @example getDateByWeekAndDay(2025, 6, 1) => "2025-02-03"
 * */
export function getDateByWeekAndDay(
	year: number,
	week: number,
	day: number
): string {
	const firstDayOfYear = new Date(year, 0, 1);
	const daysOffset = (week - 1) * 7;
	const weekStart = new Date(
		firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000
	);

	const dayOfWeek = weekStart.getDay(); // 0 (dimanche) à 6 (samedi)
	const startDate = new Date(weekStart);
	startDate.setDate(
		weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
	);

	const date = new Date(startDate);
	date.setDate(startDate.getDate() + day);
	return date.toISOString().split("T")[0];
}

/**
 * get day options by week number
 * @param {number}weekNumber
 * @param {number}year
 * @returns {date: string, label: string}[]
 * @example getDayOptions(1,2025) => [{date: "2024-12-30", label: "Lundi"}, ...]
 */
export function getDayOptions(weekNumber: number, year: number): DayOption[] {
	const dayOptions = [];
	for (let i = 1; i < 7; i++) {
		const date = getDateByWeekAndDay(year, weekNumber, i);
		const label = days[i];
		dayOptions.push({ date, label });
	}

	return dayOptions;
}
