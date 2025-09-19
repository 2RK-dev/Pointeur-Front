// noinspection JSUnusedGlobalSymbols

"use server";

import { Teacher, TeacherPost } from "@/Types/Teacher";
import { createTeacher, deleteTeacher, fetchTeachers, updateTeacher as updateTeacherApi } from "@/api/http/teacher";
import { TeacherMapper } from "@/services/mapper";
import { ICreateTeacher, IUpdateTeacher } from "@/api/types";

export async function getTeachers (): Promise<Teacher[]> {
    const teachersList = await fetchTeachers();
    return teachersList.map(teach => TeacherMapper.fromDto(teach));
}

export async function addTeacher (teacher: TeacherPost): Promise<Teacher> {
    const requestBody: ICreateTeacher = {
        name: teacher.name,
        abbreviation: teacher.abr,
    };
    const createdTeacher = await createTeacher(requestBody);
    return TeacherMapper.fromDto(createdTeacher);
}

export async function updateTeacher (id: number, teacher: TeacherPost): Promise<Teacher> {
    const requestBody: IUpdateTeacher = {
        abbreviation: teacher.abr, name: teacher.name
    };
    const updatedTeacher = await updateTeacherApi(id, requestBody);
    return TeacherMapper.fromDto(updatedTeacher);
}

export async function removeTeacher (id: number): Promise<number> {
    await deleteTeacher(id);
    return id;
}

