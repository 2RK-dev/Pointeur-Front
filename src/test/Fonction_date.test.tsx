import { getDateByDayOfWeek } from "../app/Main/EDT/Fonction_date";

describe("getDateByDayOfWeek", () => {
	it("should return the correct date for a given day of the week", () => {
		const startDate = new Date("2024-08-19"); // Assuming a known start date
		const targetDate = getDateByDayOfWeek("Mercredi", startDate);
		const expectedDate = new Date("2024-08-21"); // Assuming Wednesday is the 5th of January

		expect(targetDate).toEqual(expectedDate);
	});

	it("should handle different start dates", () => {
		const startDate = new Date("2024-08-19"); // Assuming a different start date
		const targetDate = getDateByDayOfWeek("Samedi", startDate);
		const expectedDate = new Date("2024-08-24"); // Assuming Friday is the 4th of February

		expect(targetDate).toEqual(expectedDate);
	});

	// Add more test cases as needed
});
