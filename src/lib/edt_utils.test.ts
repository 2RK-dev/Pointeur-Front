import { getDateByWeekAndDay, getDayNumber } from "./edt_utils";

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
