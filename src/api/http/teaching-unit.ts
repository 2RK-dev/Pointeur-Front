import { ITeachingUnit } from "@/api/types";
import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";

export async function fetchTeachingUnits (): Promise<ITeachingUnit[]> {
    const {data: responseData} = await http.pub.get("/teachingUnits");
    return DTO.TeachingUnitSchema.array().parse(responseData);
}