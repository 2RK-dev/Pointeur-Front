import { ITeacher } from "@/api/types";
import { http } from "@/api/http/axios";
import { DTO } from "@/api/schemas";

export async function fetchTeachers (): Promise<ITeacher[]> {
    const {data: responseData} = await http.pub.get("/teachers");
    return DTO.TeacherSchema.array().parse(responseData);
}