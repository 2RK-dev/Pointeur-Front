"use server";

export async function getTeacher(): Promise<Teacher[]> {
	const data: Teacher[] = require("./data/Teacher.json");

	return data.sort((a, b) => a.name.localeCompare(b.name));
}
