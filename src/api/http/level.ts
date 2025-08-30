"use server";

import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";
import { IGroup, ILevel } from "@/api/types";

export async function fetchLevels (): Promise<ILevel[]> {
    const {data: responseData} = await http.pub.get("/levels");
    try {
        return DTO.LevelSchema.array().parse(responseData);
    } catch (e) {
        throw e;
    }
}

export async function fetchGroupList (levelId: number): Promise<IGroup[]> {
    const {data: responseData} = await http.pub.get(`/levels/${levelId}/groups`);
    return DTO.GroupSchema.array().parse(responseData);
}