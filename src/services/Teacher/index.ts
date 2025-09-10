import { withService } from "@/services/with-service";
import { ITeacherService } from "@/services/Teacher/type";


export const {getTeachers} = await withService<ITeacherService>(
    () => import("./impl/mock"),
    () => import("./impl/real")
);