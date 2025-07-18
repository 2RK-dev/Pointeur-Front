import {create} from "zustand";
import {Level} from "@/Types/Level";

interface CurrentLevelStoreInterface {
    currentLevel: Level | null;
    setCurrentLevel: (level: Level) => void;
}

export const useCurrentLevelStore = create<CurrentLevelStoreInterface>((set) => ({
    currentLevel: null,
    setCurrentLevel: (level: Level) => set({currentLevel: level}),
}));