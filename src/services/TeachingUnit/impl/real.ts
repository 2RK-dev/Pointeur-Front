// noinspection JSUnusedGlobalSymbols

"use server";

import { TeachingUnit } from "@/Types/TeachingUnit";
import { fetchTeachingUnits } from "@/api/http/teaching-unit";

export async function getTeachingUnits(): Promise<TeachingUnit[]> {
    const teachingUnitsList = await fetchTeachingUnits();
    return teachingUnitsList.map(tu => ({
        id: tu.id,
        name: tu.name,
        abr: tu.abbreviation,
    }));
}