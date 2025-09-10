import { withService } from "@/services/with-service";
import { ILevelService } from "@/services/Level/type";


export const {getGroupInLevel, getLevels} = await withService<ILevelService>(
    () => import("./impl/mock"),
    () => import("./impl/real")
);