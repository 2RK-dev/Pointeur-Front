"use server";

import data from "@/test/Teacher.json";
import {Teacher} from "@/Types/Teacher";

export async function getTeachers(): Promise<Teacher[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return data as Teacher[];
}
