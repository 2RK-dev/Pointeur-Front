// noinspection JSUnusedGlobalSymbols

"use server";

import { LevelDetailsDTO, LevelDTO, LevelPostDTO } from "@/Types/LevelDTO";
import { createLevel, deleteLevel, fetchLevels, updateLevel } from "@/api/http/level";
import { GroupMapper, LevelMapper } from "@/services/mapper";

export async function getLevelListService (): Promise<LevelDetailsDTO[]> {
    const detailsList = await fetchLevels();
    return detailsList.map(details => ({
        level: LevelMapper.fromDto(details.level),
        groups: details.groups.map(g => GroupMapper.fromDto(g)),
    }));
}

export async function addLevelService (levelPost: LevelPostDTO): Promise<LevelDTO> {
    const createdLevel = await createLevel({
        abbreviation: levelPost.abr,
        name: levelPost.name
    });
    return LevelMapper.fromDto(createdLevel);
}

export async function updateLevelService (levelId: number, levelPost: LevelPostDTO): Promise<LevelDTO> {
    const updatedLevel = await updateLevel(levelId, {
        name: levelPost.name,
        abbreviation: levelPost.abr,
    });
    return LevelMapper.fromDto(updatedLevel);
}

export async function removeLevelService (levelId: number): Promise<void> {
    await deleteLevel(levelId);
}