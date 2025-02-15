import { getDateByWeekAndDay, getDayNumber, getDayOptions } from "./edt_utils";

describe("getDateByWeekAndDay", () => {
	it("should return the correct date for a given week and day", () => {
		// Test case 1
		expect(getDateByWeekAndDay(2025, 6, 1)).toBe("2025-02-03");

		// Test case 2
		expect(getDateByWeekAndDay(2025, 6, 2)).toBe("2025-02-04");

		// Test case 3
		expect(getDateByWeekAndDay(2025, 6, 3)).toBe("2025-02-05");

		// Add more test cases as needed
	});
});

describe("getDayNumber", () => {
	it("should return the correct day number for a given date", () => {
		// Test case 1
		expect(getDayNumber("2025-01-27")).toBe(1);

		// Test case 2
		expect(getDayNumber("2025-02-04")).toBe(2);

		// Test case 3
		expect(getDayNumber("2025-02-05")).toBe(3);

		// Add more test cases as needed
	});
});

describe("getDayOptions", () => {
	it("should return the correct day options for a given week number", () => {
		// Test case 1
		expect(getDayOptions(1, 2025)).toEqual([
			{ date: "2024-12-30", label: "Lundi" },
			{ date: "2024-12-31", label: "Mardi" },
			{ date: "2025-01-01", label: "Mercredi" },
			{ date: "2025-01-02", label: "Jeudi" },
			{ date: "2025-01-03", label: "Vendredi" },
			{ date: "2025-01-04", label: "Samedi" },
		]);

		// Test case 2
		expect(getDayOptions(6, 2025)).toEqual([
			{ date: "2025-02-03", label: "Lundi" },
			{ date: "2025-02-04", label: "Mardi" },
			{ date: "2025-02-05", label: "Mercredi" },
			{ date: "2025-02-06", label: "Jeudi" },
			{ date: "2025-02-07", label: "Vendredi" },
			{ date: "2025-02-08", label: "Samedi" },
		]);

		// Test case 3
		expect(getDayOptions(10, 2025)).toEqual([
			{ date: "2025-03-03", label: "Lundi" },
			{ date: "2025-03-04", label: "Mardi" },
			{ date: "2025-03-05", label: "Mercredi" },
			{ date: "2025-03-06", label: "Jeudi" },
			{ date: "2025-03-07", label: "Vendredi" },
			{ date: "2025-03-08", label: "Samedi" },
		]);
	});
});
