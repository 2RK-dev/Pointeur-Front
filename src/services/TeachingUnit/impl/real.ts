// noinspection JSUnusedGlobalSymbols

"use server";

import { TeachingUnit } from "@/Types/TeachingUnit";
import { fetchTeachingUnits } from "@/api/http/teaching-unit";
import { TeachingUnitMapper } from "@/services/mapper";

export async function getTeachingUnits(): Promise<TeachingUnit[]> {
    const teachingUnitsList = await fetchTeachingUnits();
    return teachingUnitsList.map(tu => TeachingUnitMapper.fromDto(tu));
}