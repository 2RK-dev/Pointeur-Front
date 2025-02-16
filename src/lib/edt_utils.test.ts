import { transposeHourlies } from "./edt_utils";

describe("transposeHourlies", () => {
	it("should transpose the hourlies array with the correct dates and ids", () => {
		const hourlies = [
			{
				edt_id: 62,
				level: "M2 IG grp2",
				start_hours: "13:30",
				end_hours: "15:30",
				ue: "SMA",
				room_abr: "S008",
				teacher: "PAT",
				date: "2025-02-01",
			},
			{
				edt_id: 63,
				level: "M2 IG grp2",
				start_hours: "09:30",
				end_hours: "11:00",
				ue: "GRID",
				room_abr: "S004",
				teacher: "VOL",
				date: "2025-02-01",
			},
			{
				edt_id: 64,
				level: "L1 GB grp1",
				start_hours: "11:00",
				end_hours: "13:00",
				ue: "ELEC-NUM",
				room_abr: "S007",
				teacher: "HER",
				date: "2025-02-02",
			},
		];

		const numberOfWeeks = 2;
		const lastIdNumber = 80;

		const transposedHourlies = transposeHourlies(
			hourlies,
			numberOfWeeks,
			lastIdNumber
		);

		expect(transposedHourlies).toEqual([
			{
				edt_id: 81,
				level: "M2 IG grp2",
				start_hours: "13:30",
				end_hours: "15:30",
				ue: "SMA",
				room_abr: "S008",
				teacher: "PAT",
				date: "2025-02-15",
			},
			{
				edt_id: 82,
				level: "M2 IG grp2",
				start_hours: "09:30",
				end_hours: "11:00",
				ue: "GRID",
				room_abr: "S004",
				teacher: "VOL",
				date: "2025-02-15",
			},
			{
				edt_id: 83,
				level: "L1 GB grp1",
				start_hours: "11:00",
				end_hours: "13:00",
				ue: "ELEC-NUM",
				room_abr: "S007",
				teacher: "HER",
				date: "2025-02-16",
			},
		]);
	});

	// Add more test cases as needed
});
