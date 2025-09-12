// noinspection JSUnusedGlobalSymbols

"use server";

import { Room } from "@/Types/Room";
import { fetchRooms } from "@/api/http/room";
import { RoomMapper } from "@/services/mapper";

export async function getRooms (): Promise<Room[]> {
    const roomList = await fetchRooms();
    return roomList.map(room => RoomMapper.fromDto(room));
}