// noinspection JSUnusedGlobalSymbols

"use server";

import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";
import { ICreateLevel, IGroup, ILevel, ILevelDetails, IUpdateLevel } from "@/api/types";

export async function fetchLevels (): Promise<ILevelDetails[]> {
    const {data: responseData} = await http.pub.get("/levels");
    return DTO.LevelDetailsSchema.array().parse(responseData);
}

export async function fetchGroupList (levelId: number): Promise<IGroup[]> {
    const {data: responseData} = await http.pub.get(`/levels/${levelId}/groups`);
    return DTO.GroupSchema.array().parse(responseData);
}

export async function createLevel (data: ICreateLevel): Promise<ILevel> {
    const {data: responseData} = await http.pub.post("/levels", data);
    return DTO.LevelSchema.parse(responseData);
}

export async function updateLevel (levelId: number, data: IUpdateLevel): Promise<ILevel> {
    const {data: responseData} = await http.pub.put(`/levels/${levelId}`, data);
    return DTO.LevelSchema.parse(responseData);
}

export async function deleteLevel (levelId: number) {
    await http.pub.delete(`/levels/${levelId}`);
}