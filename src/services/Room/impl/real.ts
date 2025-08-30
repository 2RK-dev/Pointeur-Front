// noinspection JSUnusedGlobalSymbols

"use server";

import { Room } from "@/Types/Room";
import { fetchRooms } from "@/api/http/room";

export async function getRooms (): Promise<Room[]> {
    const roomList = await fetchRooms();
    return roomList.map(room => ({
        id: room.id,
        name: room.name,
        abr: room.abbreviation,
        capacity: room.size,
    }))
}