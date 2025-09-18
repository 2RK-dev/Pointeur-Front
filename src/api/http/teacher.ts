import { ICreateTeacher, ITeacher, IUpdateTeacher } from "@/api/types";
import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";

export async function fetchTeachers (): Promise<ITeacher[]> {
    const {data: responseData} = await http.pub.get("/teachers");
    return DTO.TeacherSchema.array().parse(responseData);
}

export async function createTeacher (data: ICreateTeacher): Promise<ITeacher> {
    const {data: responseData} = await http.pub.post("/teachers", data);
    return DTO.TeacherSchema.parse(responseData);
}

export async function updateTeacher (teacherId: number, data: IUpdateTeacher): Promise<ITeacher> {
    const {data: responseData} = await http.pub.put(`/teachers/${teacherId}`, data);
    return DTO.TeacherSchema.parse(responseData);
}

export async function deleteTeacher (teacherId: number) {
    await http.pub.delete(`/teachers/${teacherId}`);
}