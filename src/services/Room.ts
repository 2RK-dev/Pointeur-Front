// noinspection JSUnusedGlobalSymbols

"use server";

import {Room, RoomPost} from "@/Types/Room";
import { fetchRooms } from "@/api/http/room";
import { RoomMapper } from "@/services/mapper";

export async function getRoomsService (): Promise<Room[]> {
    const roomList = await fetchRooms();
    return roomList.map(room => RoomMapper.fromDto(room));
}

export async function addRoomService(room: RoomPost): Promise<Room> {
    // TODO: implement addRoom logic
    throw new Error("Method not implemented.");
}

export async function updateRoomService(id: number, room: RoomPost): Promise<Room> {
    // TODO: implement updateRoom logic
    throw new Error("Method not implemented.");
}

export async function removeRoomService(id: number): Promise<Room> {
    // TODO: implement deleteRoom logic
    throw new Error("Method not implemented.");
}