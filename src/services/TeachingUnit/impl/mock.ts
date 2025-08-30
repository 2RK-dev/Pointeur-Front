// noinspection JSUnusedGlobalSymbols

"use server";

import data from "@/test/TeachingUnit.json";
import { TeachingUnit } from "@/Types/TeachingUnit";

export async function getTeachingUnits(): Promise<TeachingUnit[]> {

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return data as TeachingUnit[];
}