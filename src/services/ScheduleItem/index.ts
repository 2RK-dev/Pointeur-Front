import { withService } from "@/services/with-service";
import { IScheduleItemService } from "@/services/ScheduleItem/type";


export const {getScheduleItemsByLevel} = await withService<IScheduleItemService>(
    () => import("./impl/mock"),
    () => import("./impl/real")
);