import { withService } from "@/services/with-service";
import { ITeachingUnitService } from "./type";


export const {} = await withService<ITeachingUnitService>(
    () => import("./impl/mock"),
    () => import("./impl/real")
);