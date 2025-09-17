// noinspection JSUnusedGlobalSymbols

"use server";

import { TeachingUnit, TeachingUnitPost } from "@/Types/TeachingUnit";
import {
    createTeachingUnit,
    deleteTeachingUnit,
    fetchTeachingUnits,
    updateTeachingUnit
} from "@/api/http/teaching-unit";
import { TeachingUnitMapper } from "@/services/mapper";
import { ICreateTeachingUnitSchema, IUpdateTeachingUnitSchema } from "@/api/types";

export async function getTeachingUnits (): Promise<TeachingUnit[]> {
    const teachingUnitsList = await fetchTeachingUnits();
    return teachingUnitsList.map(tu => TeachingUnitMapper.fromDto(tu));
}

export async function AddTeachingUnitService (data: TeachingUnitPost): Promise<TeachingUnit> {
    const requestBody: ICreateTeachingUnitSchema = {
        name: data.name,
        abbreviation: data.abr,
        levelId: data.associatedLevels,
    };
    const createdTeachingUnit = await createTeachingUnit(requestBody);
    return TeachingUnitMapper.fromDto(createdTeachingUnit);
}

export async function UpdateTeachingUnitService (id: number, data: TeachingUnitPost): Promise<TeachingUnit> {
    const requestBody: IUpdateTeachingUnitSchema = {
        name: data.name,
        abbreviation: data.abr,
        levelId: data.associatedLevels,
    };
    const updatedTeachingUnit = await updateTeachingUnit(id, requestBody);
    return TeachingUnitMapper.fromDto(updatedTeachingUnit);
}

export async function RemoveTeachingUnitService (id: number): Promise<number> {
    await deleteTeachingUnit(id);
    return id;
}