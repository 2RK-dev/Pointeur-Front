export interface Room {
	room_id: number;
	room_name: string;
	room_abr: string;
	room_capacity: number;
}

export const initialRooms: Room[] = [
	{
		room_id: 1,
		room_name: "Salle 001",
		room_abr: "S001",
		room_capacity: 50,
	},
	{
		room_id: 2,
		room_name: "Salle 004",
		room_abr: "S004",
		room_capacity: 30,
	},
	{
		room_id: 3,
		room_name: "Salle 112",
		room_abr: "S112",
		room_capacity: 200,
	},
	{
		room_id: 4,
		room_name: "Salle 007",
		room_abr: "S007",
		room_capacity: 20,
	},
	{
		room_id: 5,
		room_name: "Salle 008",
		room_abr: "S008",
		room_capacity: 25,
	},
	{
		room_id: 6,
		room_name: "Salle 106",
		room_abr: "S106",
		room_capacity: 60,
	},
	{
		room_id: 7,
		room_name: "Salle 102",
		room_abr: "S102",
		room_capacity: 35,
	},
	{
		room_id: 8,
		room_name: "Salle 210",
		room_abr: "S210",
		room_capacity: 150,
	},
	{
		room_id: 9,
		room_name: "Salle 009",
		room_abr: "S009",
		room_capacity: 15,
	},
	{
		room_id: 10,
		room_name: "Salle 012",
		room_abr: "S012",
		room_capacity: 15,
	},
];
