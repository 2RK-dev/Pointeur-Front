import { ICreateRoom, IRoom, IUpdateRoom } from "@/api/types";
import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";

export async function fetchRooms (): Promise<IRoom[]> {
    const {data: responseData} = await http.pub.get("/rooms");
    return DTO.RoomSchema.array().parse(responseData);
}

export async function createRoom (data: ICreateRoom): Promise<IRoom> {
    const {data: responseData} = await http.pub.post("/rooms", data);
    return DTO.RoomSchema.parse(responseData);
}

export async function updateRoom (roomId: number, data: IUpdateRoom): Promise<IRoom> {
    const {data: responseData} = await http.pub.put(`/rooms/${roomId}`, data);
    return DTO.RoomSchema.parse(responseData);
}

export async function deleteRoom (roomId: number) {
    await http.pub.delete(`/rooms/${roomId}`);
}