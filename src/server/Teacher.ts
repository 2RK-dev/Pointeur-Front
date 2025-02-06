"use server";

export async function getTeacher(): Promise<Teacher[]> {
	const data: Teacher[] = require("./data/Teacher.json");
	console.log(data);
	return data.sort((a, b) => a.name.localeCompare(b.name));
}
