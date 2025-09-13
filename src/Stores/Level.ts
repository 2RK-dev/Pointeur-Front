import {create} from "zustand";
import {Level} from "@/Types/Level";

interface LevelStoreInterface {
    levels: Level[] | null;
    setLevels: (levels: Level[]) => void;
    addLevel: (level: Level) => void;
    updateLevel: (id: number, level: Level) => void;
    removeLevel: (id: number) => void;
}

export const useLevelStore = create<LevelStoreInterface>((set) => ({
    levels: null,
    setLevels: (levels: Level[]) => set({levels}),
    addLevel: (level: Level) => set((state) => ({
        levels: state.levels ? [...state.levels, level] : [level]
    })),
    updateLevel: (id: number, level: Level) => set((state) => ({
        levels: state.levels ? state.levels.map(l => l.id === id ? {...l, ...level} : l) : [level]
    })),
    removeLevel: (id: number) => set((state) => ({
        levels: state.levels ? state.levels.filter(level => level.id !== id) : null
    })),
}));
1
interface SelectedLevelStoreInterface {
    selectedLevel: Level | null;
    setSelectedLevel: (level: Level) => void;
}

export const useSelectedLevelStore = create<SelectedLevelStoreInterface>((set) => ({
    selectedLevel: null,
    setSelectedLevel: (level: Level) => set({selectedLevel: level}),
}));

