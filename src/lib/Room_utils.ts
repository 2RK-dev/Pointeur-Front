export interface Room {
	room_id: number;
	room_name: string;
	room_abr: string;
	room_capacity: number;
}

export const initialRooms: Room[] = [
	{
		room_id: 1,
		room_name: "Salle de conférence A",
		room_abr: "S001",
		room_capacity: 50,
	},
	{
		room_id: 2,
		room_name: "Laboratoire informatique",
		room_abr: "S004",
		room_capacity: 30,
	},
	{
		room_id: 3,
		room_name: "Amphithéâtre principal",
		room_abr: "S112",
		room_capacity: 200,
	},
	{
		room_id: 4,
		room_name: "Salle de réunion B",
		room_abr: "S007",
		room_capacity: 20,
	},
	{
		room_id: 5,
		room_name: "Salle de classe C",
		room_abr: "S008",
		room_capacity: 25,
	},
	{
		room_id: 6,
		room_name: "Salle de conférence D",
		room_abr: "S106",
		room_capacity: 60,
	},
	{
		room_id: 7,
		room_name: "Laboratoire de chimie",
		room_abr: "S102",
		room_capacity: 35,
	},
	{
		room_id: 8,
		room_name: "Amphithéâtre secondaire",
		room_abr: "S210",
		room_capacity: 150,
	},
	{
		room_id: 9,
		room_name: "Salle de réunion E",
		room_abr: "S009",
		room_capacity: 15,
	},
];
