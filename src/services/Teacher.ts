// noinspection JSUnusedGlobalSymbols

"use server";

import { Teacher } from "@/Types/Teacher";
import { fetchTeachers } from "@/api/http/teacher";
import { TeacherMapper } from "@/services/mapper";

export async function getTeachers (): Promise<Teacher[]> {
    const teachersList = await fetchTeachers();
    return teachersList.map(teach => TeacherMapper.fromDto(teach));
}
