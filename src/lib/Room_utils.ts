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
		room_abr: "CONF-A",
		room_capacity: 50,
	},
	{
		room_id: 2,
		room_name: "Laboratoire informatique",
		room_abr: "LAB-INFO",
		room_capacity: 30,
	},
	{
		room_id: 3,
		room_name: "Amphithéâtre principal",
		room_abr: "AMPHI-P",
		room_capacity: 200,
	},
];
