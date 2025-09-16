// noinspection JSUnusedGlobalSymbols

"use server";

import {TeachingUnit, TeachingUnitPost} from "@/Types/TeachingUnit";
import { fetchTeachingUnits } from "@/api/http/teaching-unit";
import { TeachingUnitMapper } from "@/services/mapper";

export async function getTeachingUnits(): Promise<TeachingUnit[]> {
    const teachingUnitsList = await fetchTeachingUnits();
    return teachingUnitsList.map(tu => TeachingUnitMapper.fromDto(tu));
}

export async function AddTeachingUnitService(data: TeachingUnitPost): Promise<TeachingUnit> {
    // TODO: implement the service to add a teaching unit
    throw new Error("Not implemented");
}

export async function UpdateTeachingUnitService(id: number, data: TeachingUnitPost): Promise<TeachingUnit> {
    // TODO: implement the service to update a teaching unit
    throw new Error("Not implemented");
}

export async function RemoveTeachingUnitService(id: number): Promise<TeachingUnit> {
    // TODO: implement the service to remove a teaching unit
    throw new Error("Not implemented");
}