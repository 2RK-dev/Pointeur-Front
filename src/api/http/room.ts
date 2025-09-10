import { IRoom } from "@/api/types";
import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";

export async function fetchRooms (): Promise<IRoom[]> {
    const {data: responseData} = await http.pub.get("/rooms");
    return DTO.RoomSchema.array().parse(responseData);
}