import { Level } from "@/Types/Level";
import { Group } from "@/Types/Group";

/**
 * Level Service Type Definition.
 * This interface defines the functions to be exported by all the Level Service implementations.
 * Services should only export functions.
 */
export type ILevelService = {
    getLevels: () => Promise<Level[]>;
    getGroupInLevel: (levelId: number) => Promise<Group[]>;
}