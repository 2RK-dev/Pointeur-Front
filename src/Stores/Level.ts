import {create} from "zustand";
import {Level} from "@/Types/Level";



interface SelectedLevelStoreInterface {
    selectedLevel: Level | null;
    setSelectedLevel: (level: Level) => void;
}

export const useSelectedLevelStore = create<SelectedLevelStoreInterface>((set) => ({
    selectedLevel: null,
    setSelectedLevel: (level: Level) => set({selectedLevel: level}),
}));