"use server";

import { getWeekDateRange } from "@/lib/common/dateUtils";
import { hourly } from "@/lib/edt_utils";

export async function getedt(
	weekNumber: number,
	year: number
): Promise<hourly[]> {
	const edt: hourly[] = require("./data/edt.json");
	const weekRange = getWeekDateRange(weekNumber, year);
	let data: hourly[] = edt.filter((item) => {
		return item.date >= weekRange.start && item.date <= weekRange.end;
	});
	return data;
}
