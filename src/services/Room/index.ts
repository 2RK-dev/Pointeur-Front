import { withService } from "@/services/with-service";
import { IRoomService } from "@/services/Room/type";


export const {getRooms} = await withService<IRoomService>(
    () => import("./impl/mock"),
    () => import("./impl/real")
);