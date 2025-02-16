import { getWeekDateRange } from "./common/dateUtils";

export interface hourly {
	edt_id: number;
	level: string;
	start_hours: string;
	end_hours: string;
	ue: string;
	room_abr: string;
	teacher: string;
	date: string;
}

export const CURRENT_YEAR = new Date().getFullYear();

export const BASE_SLOT_HEIGHT = 90;

export const hours = [
	"7:00",
	"8:00",
	"10:00",
	"12:00",
	"14:00",
	"16:00",
	"18:00",
];

export const groupes: { [key: string]: string[] } = {
	L1: ["grp1", "grp2", "grp3", "grp4", "grp5", "grp6"],
	L2: ["grp3", "grp4"],
	L3: ["grp5", "grp6"],
};

export const initialHoraire: hourly = {
	edt_id: 0,
	level: "",
	start_hours: "07:00",
	end_hours: "08:00",
	ue: "",
	room_abr: "",
	teacher: "",
	date: "",
};

export const getStyleHours = (
	hours: string[],
	heure: string,
	index: number
) => {
	const minutesActuelles = timeToMinutes(heure);
	const minutesSuivantes =
		index < hours.length - 1 ? timeToMinutes(hours[index + 1]) : null;

	const differenceEnMinutes =
		minutesSuivantes !== null ? minutesSuivantes - minutesActuelles : null;

	const largeurPourcentage =
		differenceEnMinutes !== null
			? Math.min((differenceEnMinutes / 120) * 100, 100)
			: 100;

	const style: React.CSSProperties = {
		flexBasis: `${largeurPourcentage}%`,
	};
	return style;
};

/**
 * Converts a time string (HH:mm) into total minutes since midnight.
 * @param time
 * @returns {number}
 * @example timeToMinutes("07:30") => 450
 */
export function timeToMinutes(time: string): number {
	const [hours, minutes] = time.split(":").map(Number);
	if (isNaN(hours) || isNaN(minutes)) {
		throw new Error(`Invalid time format: ${time}`);
	}
	return hours * 60 + minutes;
}

/**
 * Calculates the horizontal position (%) of a time block based on start time.
 * Assumes the schedule starts at 07:00 and spans 11 hours (07:00 - 18:00).
 * @param startTime
 * @returns {number}
 * @example calculatePosition("07:30") => 25
 */
export function calculatePosition(startTime: string): number {
	const startMinutes = timeToMinutes(startTime);
	const dayStartMinutes = timeToMinutes("07:00");
	return ((startMinutes - dayStartMinutes) / (11 * 60)) * 100;
}

/**
 * Calculates the width (%) of a time block based on start and end times.
 * Assumes the schedule starts at 07:00 and spans 11 hours (07:00 - 18:00).
 * @param startTime
 * @param endTime
 * @returns {number}
 * @example calculateWidth("07:30", "09:00") => 25
 */
export function calculateWidth(startTime: string, endTime: string): number {
	const start = timeToMinutes(startTime);
	const end = timeToMinutes(endTime);
	const dayStart = timeToMinutes("07:00");
	const dayEnd = timeToMinutes("18:00");
	const totalMinutes = dayEnd - dayStart;
	return ((end - start) / totalMinutes) * 100;
}

/**
 * Returns an array of week options for the current year.
 * @param year
 * @returns {value: string, label: string}[]
 * @example getWeekOptions(2025) => [{value: "1", label: "Semaine 1 (30/12 - 04/5)"}, ...]
 */
export function getWeekOptions(
	year: number
): { value: string; label: string }[] {
	const weekOptions = [];
	for (let i = 1; i <= 52; i++) {
		const { start, end } = getWeekDateRange(i, year);
		const startDate = new Date(start);
		const endDate = new Date(end);
		const label = `Semaine ${i} (${startDate.getDate()}/${
			startDate.getMonth() + 1
		} - ${endDate.getDate()}/${endDate.getMonth() + 1})`;
		weekOptions.push({ value: i.toString(), label });
	}
	return weekOptions;
}

/**
 * Formats the duration between two times (HH:mm) as "XhYY".
 * @param startTime
 * @param endTime
 * @returns {string}
 * @example formatDuration("07:30", "09:00") => "1h30"
 */
export function formatDuration(startTime: string, endTime: string): string {
	const start = timeToMinutes(startTime);
	const end = timeToMinutes(endTime);
	const durationInMinutes = end - start;
	const hours = Math.floor(durationInMinutes / 60);
	const minutes = durationInMinutes % 60;
	return `${hours}h${minutes.toString().padStart(2, "0")}`;
}

/**
 * Generates a color class based on the group name.
 * @param groupName
 * @returns {string}
 * @example generateColorByGroup("L1 grp1") => "bg-blue-100 hover:bg-blue-200"
 */
export function generateColorByGroup(groupName: string): string {
	const colors = [
		"bg-blue-100 hover:bg-blue-200",
		"bg-green-100 hover:bg-green-200",
		"bg-yellow-100 hover:bg-yellow-200",
		"bg-purple-100 hover:bg-purple-200",
		"bg-pink-100 hover:bg-pink-200",
		"bg-orange-100 hover:bg-orange-200",
		"bg-teal-100 hover:bg-teal-200",
		"bg-indigo-100 hover:bg-indigo-200",
	];

	let hash = 0;
	for (let i = 0; i < groupName.length; i++) {
		hash = groupName.charCodeAt(i) + ((hash << 5) - hash);
	}

	const index = Math.abs(hash) % colors.length;
	return colors[index];
}

/**
 * Checks if two time blocks are overlapping.
 * @param hourly1
 * @param hourly2
 * @returns {boolean}
 * @example isOverlapping({start_hours: "07:00", end_hours: "08:00"}, {start_hours: "08:00", end_hours: "09:00"}) => false
 * @example isOverlapping({start_hours: "07:00", end_hours: "08:00"}, {start_hours: "07:30", end_hours: "08:30"}) => true
 * @example isOverlapping({start_hours: "07:00", end_hours: "08:00"}, {start_hours: "07:30", end_hours: "07:45"}) => true
 * */
export function isOverlapping(hourly1: hourly, hourly2: hourly): boolean {
	const [start1, end1] = [
		timeToMinutes(hourly1.start_hours),
		timeToMinutes(hourly1.end_hours),
	];
	const [start2, end2] = [
		timeToMinutes(hourly2.start_hours),
		timeToMinutes(hourly2.end_hours),
	];
	return !(end1 <= start2 || start1 >= end2);
}

/**
 * Calculates the row index of a time block based on its position in the schedule.
 * @param rowAssignments
 * @param horaire
 * @returns {number}
 * @example calculateRowIndex({0: [{start_hours: "07:00", end_hours: "08:00"}]}, {start_hours: "07:00", end_hours: "08:00"}) => 0
 * @example calculateRowIndex({0: [{start_hours: "07:00", end_hours: "08:00"}]}, {start_hours: "08:00", end_hours: "09:00"}) => 1
 * @example calculateRowIndex({0: [{start_hours: "07:00", end_hours: "08:00"}, {start_hours: "08:00", end_hours: "09:00"}]}, {start_hours: "07:00", end_hours: "08:00"}) => 0
 */
export function calculateRowIndex(
	rowAssignments: Record<number, hourly[]>,
	horaire: hourly
): number {
	return Object.keys(rowAssignments).findIndex((key) =>
		rowAssignments[parseInt(key)].includes(horaire)
	);
}

/**
 * Calculates the row assignments for a list of time blocks.
 * @param horaires
 * @returns {normalRows: Record<number, hourly[]>}
 * @example calculateRowAssignments([{start_hours: "07:00", end_hours: "08:00"}, {start_hours: "08:00", end_hours: "09:00"}]) => {normalRows: {0: [{start_hours: "07:00", end_hours: "08:00"}], 1: [{start_hours: "08:00", end_hours: "09:00"}]}}
 */
export function calculateRowAssignments(horaires: hourly[]) {
	const rows: Record<number, hourly[]> = {};

	// Tri des horaires
	horaires.sort(
		(a, b) => timeToMinutes(a.start_hours) - timeToMinutes(b.end_hours)
	);

	// Affectation des rangées
	horaires.forEach((horaire) => {
		const assignedRow = Object.keys(rows).find((row) =>
			rows[parseInt(row)].every(
				(existingHoraire) => !isOverlapping(existingHoraire, horaire)
			)
		);

		// Ajouter à une rangée existante ou créer une nouvelle rangée
		const rowIndex = assignedRow
			? parseInt(assignedRow)
			: Object.keys(rows).length;
		rows[rowIndex] = rows[rowIndex] || [];
		rows[rowIndex].push(horaire);
	});

	return { normalRows: rows };
}

/**
 * Duplicates the hourly data for a given week and shifts it to another week, returning the new entries to be added.
 * @param hourlies
 * @param numberOfWeeks
 * @param lastIdNumber
 * @returns {hourly[]}
 * @example transposeHourlies([{edt_id: 1, date: "2025-02-03"}, {edt_id: 2, date: "2025-02-04"}], 1, 2) => [{edt_id: 3, date: "2025-02-10"}, {edt_id: 4, date: "2025-02-11"}]
 */
export function transposeHourlies(
	hourlies: hourly[],
	numberOfWeeks: number,
	lastIdNumber: number
): hourly[] {
	return hourlies.map((horaire, index) => {
		const date = new Date(horaire.date);
		date.setDate(date.getDate() + numberOfWeeks * 7);
		return {
			...horaire,
			edt_id: lastIdNumber + index + 1,
			date: date.toISOString().split("T")[0],
		};
	});
}
