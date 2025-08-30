import { Teacher } from "@/Types/Teacher";

/**
 * Teacher Service Type Definition.
 * This interface defines the functions to be exported by all the Teacher Service implementations.
 * Services should only export functions.
 */
export type ITeacherService = {
    getTeachers(): Promise<Teacher[]>
}