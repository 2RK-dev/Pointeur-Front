"use server";

import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";
import { IGroup, ILevelDetails } from "@/api/types";

export async function fetchLevels (): Promise<ILevelDetails[]> {
    const {data: responseData} = await http.pub.get("/levels");
    return DTO.LevelDetailsSchema.array().parse(responseData);
}

export async function fetchGroupList (levelId: number): Promise<IGroup[]> {
    const {data: responseData} = await http.pub.get(`/levels/${levelId}/groups`);
    return DTO.GroupSchema.array().parse(responseData);
}