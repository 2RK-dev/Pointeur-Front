// noinspection JSUnusedGlobalSymbols

"use server";

import { Teacher } from "@/Types/Teacher";
import { fetchTeachers } from "@/api/http/teacher";

export async function getTeachers (): Promise<Teacher[]> {
    const teachersList = await fetchTeachers();
    return teachersList.map(teach => ({
        id: teach.id,
        abr: teach.abbreviation,
        name: teach.name
    }));
}
