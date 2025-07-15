"use server";

import { Room } from "@/lib/Room_utils";

const BACK_URL = process.env.BACK_URL;

export async function getRoom(): Promise<Room[]> {
	try {
		console.log("Fetching rooms from:", BACK_URL);
		const response = await fetch(`${BACK_URL}/Room`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("Response status:", response.status);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.log("Error fetching rooms:", error);
		throw error;
	}
}
