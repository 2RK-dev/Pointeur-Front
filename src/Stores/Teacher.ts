import {create} from "zustand";
import {Teacher} from "@/Types/Teacher";

interface TeacherStoreInterface{
    teachers: Teacher[],
    setTeachers: (teachers: Teacher[]) => void,
    addTeacher: (teacher: Teacher) => void,
    updateTeacher: (id: number, teacher: Teacher) => void,
    removeTeacher: (id: number) => void,
}

export const useTeacherStore = create<TeacherStoreInterface>((set) => ({
    teachers: [],
    setTeachers: (teachers: Teacher[]) => set({teachers}),
    addTeacher: (teacher: Teacher) => set((state) => ({
        teachers: [...state.teachers, teacher]
    })),
    updateTeacher: (id: number, teacher: Teacher) => set((state) => ({
        teachers: state.teachers.map(t => t.id === id ? {...t, ...teacher} : t)
    })),
    removeTeacher: (id: number) => set((state) => ({
        teachers: state.teachers.filter(teacher => teacher.id !== id)
    })),
}));