"use server";

export async function getMatterForLevel(level: string): Promise<Matter[]> {
	const data = require("./data/Matter.json");
	const list: List_Matter[] = data.filter((item: List_Matter) => {
		return item.Level === level;
	});

	return list[0].Matter.sort((a: Matter, b: Matter) => {
		return a.name.localeCompare(b.name);
	});
}
