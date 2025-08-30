import { TeachingUnit } from "@/Types/TeachingUnit";

export type ITeachingUnitService = {
    getTeachingUnits(): Promise<TeachingUnit[]>,
}