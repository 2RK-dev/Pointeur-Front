// noinspection JSUnusedGlobalSymbols

"use server";

import {LevelDetailsDTO, LevelDTO, LevelPostDTO} from "@/Types/LevelDTO";
import {fetchLevels} from "@/api/http/level";
import {GroupMapper, LevelMapper} from "@/services/mapper";

export async function getLevelListService (): Promise<LevelDetailsDTO[]> {
    const detailsList = await fetchLevels();
    return detailsList.map(details => ({
        level: LevelMapper.fromDto(details.level),
        groups: details.groups.map(g => GroupMapper.fromDto(g)),
    }));
}

export async function addLevelService (levelPost: LevelPostDTO): Promise<LevelDTO> {
    //TODO: implement add level API call
    throw new Error("Not implemented.");
}

export async function updateLevelService (levelId: number, levelPost: LevelPostDTO): Promise<LevelDTO> {
    //TODO: implement update level API call
    throw new Error("Not implemented.");
}

export async function removeLevelService (levelId: number): Promise<void> {
    //TODO: implement delete level API call
    throw new Error("Not implemented.");
}