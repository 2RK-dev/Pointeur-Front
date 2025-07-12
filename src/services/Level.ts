"use server";

import data from "@/test/Level.json";
import {Level} from "@/Types/Level";
import {Group} from "@/Types/Group";

export async function getLevels():Promise<Level[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return data as Level[];
}

export async function getGroupInLevel(levelId: number): Promise<Group[]>{
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const level = data.find((l) => l.id === levelId);
    if (!level) {
        throw new Error(`Level with id ${levelId} not found`);
    }
    return level.groups;
}