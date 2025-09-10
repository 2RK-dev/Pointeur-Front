// noinspection JSUnusedGlobalSymbols

"use server";

import { Level } from "@/Types/Level";
import { Group } from "@/Types/Group";
import { fetchGroupList, fetchLevels } from "@/api/http/level";
import { GroupMapper } from "@/services/mapper";

export async function getLevels (): Promise<Level[]> {
    const detailsList = await fetchLevels();
    return detailsList.map(details => ({
        id: details.level.id,
        name: details.level.name,
        groups: details.groups.map(g => GroupMapper.fromDto(g)),
    }));
}

export async function getGroupInLevel (levelId: number): Promise<Group[]> {
    const groupList = await fetchGroupList(levelId);
    return groupList.map(group => GroupMapper.fromDto(group));
}