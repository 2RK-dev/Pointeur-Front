"use server";

import { Horaire, getDayNumber, getWeekDateRange } from "@/lib/edt_utils";

interface hourly {
	id: string;
	level: string;
	start_hours: string;
	end_hours: string;
	ue: string;
	room_abr: string;
	teacher: string;
	date: string;
}

export async function getedt(
	weekNumber: number,
	year: number
): Promise<Horaire[]> {
	const edt: hourly[] = require("./data/edt.json");
	const weekRange = getWeekDateRange(weekNumber, year);
	let data: hourly[] = edt.filter((item) => {
		return item.date >= weekRange.start && item.date <= weekRange.end;
	});
	return data.map((item) => {
		return {
			id: item.id,
			id_grp: item.level,
			jour: getDayNumber(item.date),
			heure_debut: item.start_hours,
			heure_fin: item.end_hours,
			id_ue: item.ue,
			id_salle: item.room_abr,
			id_prof: item.teacher,
			semaine: weekNumber,
		};
	});
}
