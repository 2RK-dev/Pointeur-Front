// noinspection JSUnusedGlobalSymbols

"use server";

import { Room, RoomPost } from "@/Types/Room";
import { createRoom, deleteRoom, fetchRooms, updateRoom } from "@/api/http/room";
import { RoomMapper } from "@/services/mapper";

export async function getRoomsService (): Promise<Room[]> {
    const roomList = await fetchRooms();
    return roomList.map(room => RoomMapper.fromDto(room));
}

export async function addRoomService (room: RoomPost): Promise<Room> {
    const createdRoom = await createRoom({
        abbreviation: room.abr,
        size: room.capacity,
        name: room.name
    });
    return RoomMapper.fromDto(createdRoom);
}

export async function updateRoomService (id: number, room: RoomPost): Promise<Room> {
    const updatedRoom = await updateRoom(
        id,
        {
            abbreviation: room.abr,
            name: room.name,
            size: room.capacity
        }
    );
    return RoomMapper.fromDto(updatedRoom);
}

export async function removeRoomService (id: number): Promise<number> {
    await deleteRoom(id);
    return id;
}