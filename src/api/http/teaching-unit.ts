import { ICreateTeachingUnitSchema, ITeachingUnit, IUpdateTeachingUnitSchema } from "@/api/types";
import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";

export async function fetchTeachingUnits (): Promise<ITeachingUnit[]> {
    const {data: responseData} = await http.pub.get("/teachingUnits");
    return DTO.TeachingUnitSchema.array().parse(responseData);
}

export async function createTeachingUnit (data: ICreateTeachingUnitSchema): Promise<ITeachingUnit> {
    const {data: responseData} = await http.pub.post("/teachingUnits", data);
    return DTO.TeachingUnitSchema.parse(responseData);
}

export async function deleteTeachingUnit (unitId: number) {
    await http.pub.delete(`/teachingUnits/${unitId}`);
}

export async function updateTeachingUnit (unitId: number, data: IUpdateTeachingUnitSchema): Promise<ITeachingUnit> {
    const {data: responseData} = await http.pub.put(`/teachingUnits/${unitId}`, data);
    return DTO.TeachingUnitSchema.parse(responseData);
}