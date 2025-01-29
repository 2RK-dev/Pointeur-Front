export interface Horaire {
	id: string;
	id_grp: string;
	jour: number;
	heure_debut: string;
	heure_fin: string;
	id_ue: string;
	id_salle: string;
	id_prof: string;
	semaine: number;
}

export const BASE_SLOT_HEIGHT = 90;
export const days: string[] = [
	"Lundi",
	"Mardi",
	"Mercredi",
	"Jeudi",
	"Vendredi",
	"Samedi",
];
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

export const ue: string[] = [
	"IA",
	"Java",
	"RO",
	"ASDA",
	"ANG",
	"Archi",
	"Archi log",
	"GLog",
	"PatronC",
	"C#",
	"Base Info",
	"BDA",
	"Algo",
];

export const prof = [
	"VOL",
	"RAL",
	"THM",
	"BRC",
	"HJS",
	"HAJ",
	"LEA",
	"BEN",
	"MAD",
	"SIK",
	"CYP",
];

export const initialHoraire: Horaire = {
	id: "",
	id_grp: "",
	jour: 0,
	heure_debut: "07:00",
	heure_fin: "08:00",
	id_ue: "",
	id_salle: "",
	id_prof: "",
	semaine: 1,
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
 */
export function calculatePosition(startTime: string): number {
	const startMinutes = timeToMinutes(startTime);
	const dayStartMinutes = timeToMinutes("07:00");
	return ((startMinutes - dayStartMinutes) / (11 * 60)) * 100;
}

/**
 * Calculates the width (%) of a time block based on start and end times.
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
 * Returns the current week number of the year.
 */
export function getCurrentWeekNumber(): number {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 1);
	const diff = now.getTime() - start.getTime();
	const oneWeek = 1000 * 60 * 60 * 24 * 7;
	return Math.ceil(diff / oneWeek);
}

/**
 * Returns the start and end dates of a week based on its number and year.
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

//Get Week number by date string
export function getWeekNumber(dateString: string): number {
	const date = new Date(dateString);
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Generates an array of week options with formatted labels (Week X + Date Range).
 */
export function getWeekOptions(): { value: string; label: string }[] {
	const currentWeek = getCurrentWeekNumber();
	return Array.from({ length: 52 }, (_, i) => {
		const weekNumber = (currentWeek + i) % 52 || 52;
		const startDate = new Date(
			new Date().getFullYear(),
			0,
			1 + (weekNumber - 1) * 7
		);
		const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
		const formatDate = (date: Date) =>
			`${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
				.toString()
				.padStart(2, "0")}`;
		return {
			value: weekNumber.toString(),
			label: `Semaine ${weekNumber} (${formatDate(startDate)} - ${formatDate(
				endDate
			)})`,
		};
	});
}

//get the day number by date string (between 0 and 6)
export function getDayNumber(dateString: string): number {
	const date = new Date(dateString);
	return date.getDay();
}

/**
 * Formats the duration between two times (HH:mm) as "XhYY".
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
 */
export function generateColorByGroup(groupName: string): string {
	const colors = [
		"bg-blue-100 hover:bg-blue-200",
		"bg-green-100 hover:bg-green-200",
		"bg-yellow-100 hover:bg-yellow-200",
		"bg-purple-100 hover:bg-purple-200",
		"bg-pink-100 hover:bg-pink-200",
		"bg-orange-100 hover:bg-orange-200",
	];
	const index = parseInt(groupName.replace(/[^\d]/g, "")) % colors.length;
	return colors[index];
}
