import {create} from "zustand";
import {LevelDetailsDTO, LevelDTO} from "@/Types/LevelDTO";
import {GroupDTO} from "@/Types/GroupDTO";

interface LevelStoreInterface {
    levelsDetails: LevelDetailsDTO[] | null;
    setLevels: (levels: LevelDetailsDTO[]) => void;
    addLevel: (level: LevelDetailsDTO) => void;
    updateLevel: (id: number, level: LevelDTO) => void;
    removeLevel: (id: number) => void;
    addGroupInLevel: (levelId: number, group: GroupDTO) => void;
    updateGroupInLevel: (id: number, group: GroupDTO) => void;
    removeGroupInLevel: (levelId: number, groupId: number) => void;
}

export const useLevelStore = create<LevelStoreInterface>((set) => ({
    levelsDetails: null,
    setLevels: (levels: LevelDetailsDTO[]) => set({levelsDetails: levels}),
    addLevel: (level: LevelDetailsDTO) => set((state) => ({
        levelsDetails: state.levelsDetails ? [...state.levelsDetails, level] : [level]
    })),
    updateLevel: (id: number, level: LevelDTO) => set((state) => ({
        levelsDetails: state.levelsDetails ? state.levelsDetails.map(levelDetail => ({
            ...levelDetail,
            level: levelDetail.level.id === id ? {...levelDetail.level, ...level} : levelDetail.level
        })) : null
    })),
    removeLevel: (id: number) => set((state) => ({
        levelsDetails: state.levelsDetails ? state.levelsDetails.filter(levelDetail => levelDetail.level.id !== id) : null
    })),
    addGroupInLevel: (levelId: number, group: GroupDTO) => set((state) => ({
        levelsDetails: state.levelsDetails ? state.levelsDetails.map(levelDetail => {
            if (levelDetail.level.id === levelId) {
                return {
                    ...levelDetail,
                    groups: [...levelDetail.groups, group]
                };
            }
            return levelDetail;
        }) : null
    })),
    updateGroupInLevel: (id: number, group: GroupDTO) => set((state) => ({
        levelsDetails: state.levelsDetails ? state.levelsDetails.map(levelDetail => ({
            ...levelDetail,
            groups: levelDetail.groups.map(g => g.id === id ? {...g, ...group} : g)
        })) : null
    })),
    removeGroupInLevel: (levelId: number, groupId: number) => set((state) => ({
        levelsDetails: state.levelsDetails ? state.levelsDetails.map(levelDetail => {
            if (levelDetail.level.id === levelId) {
                return {
                    ...levelDetail,
                    groups: levelDetail.groups.filter(g => g.id !== groupId)
                };
            }
            return levelDetail;
        }) : null
    })),
}));
