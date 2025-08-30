import { withService } from "@/services/with-service";
import { IGroupService } from "@/services/Group/type";

export const {} = await withService<IGroupService>(
    () => import("./impl/mock"),
    () => import("./impl/real")
);