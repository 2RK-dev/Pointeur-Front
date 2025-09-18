// noinspection JSUnusedGlobalSymbols

"use server";

import {Teacher, TeacherPost} from "@/Types/Teacher";
import { fetchTeachers } from "@/api/http/teacher";
import { TeacherMapper } from "@/services/mapper";

export async function getTeachers (): Promise<Teacher[]> {
    const teachersList = await fetchTeachers();
    return teachersList.map(teach => TeacherMapper.fromDto(teach));
}

export async function addTeacher (teacher: TeacherPost): Promise<Teacher> {
    // TODO: implement addTeacher function
    throw new Error("Function not implemented.");
}

export async function updateTeacher (id: number, teacher: TeacherPost): Promise<Teacher> {
    // TODO: implement updateTeacher function
    throw new Error("Function not implemented.");
}

export async function removeTeacher (id: number): Promise<number> {
    // TODO: implement removeTeacher function
    throw new Error("Function not implemented.");
}

