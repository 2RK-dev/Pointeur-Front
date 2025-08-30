// noinspection JSUnusedGlobalSymbols

"use server";

import { Level } from "@/Types/Level";
import { Group } from "@/Types/Group";
import { fetchGroupList, fetchLevels } from "@/api/http/level";

export async function getLevels (): Promise<Level[]> {
    const levelList = await fetchLevels();
    return levelList.map(level => ({
        id: level.id,
        name: level.name,
        groups: []
    }));
}

export async function getGroupInLevel (levelId: number): Promise<Group[]> {
    const groupList = await fetchGroupList(levelId);
    return groupList.map(group => ({
        id: group.id,
        name: group.name,
        abr: group.name,
        size: group.size
    }));
}