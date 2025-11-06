import { ICreateGroup, IGroup, IUpdateGroupSchema } from "@/api/types";
import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";

export async function createGroup (levelId: number, data: ICreateGroup): Promise<IGroup> {
    const {data: responseData} = await http.pub.post(`/levels/${levelId}/groups`, data);
    return DTO.GroupSchema.parse(responseData);
}

export async function deleteGroup (levelId: number, groupId: number) {
    await http.pub.delete(`/levels/${levelId}/groups/${groupId}`);
}

export async function updateGroup (levelId: number, groupId: number, data: IUpdateGroupSchema): Promise<IGroup> {
    const {data: responseData} = await http.pub.put(`/levels/${levelId}/groups/${groupId}`, data);
    return DTO.GroupSchema.parse(responseData);
}