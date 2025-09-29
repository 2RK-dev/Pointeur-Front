import {create} from 'zustand';
import {TeachingUnit} from "@/Types/TeachingUnit";

interface useTeachingUnitStore {
    teachingUnits: TeachingUnit[] | null;
    setTeachingUnits: (units: TeachingUnit[]) => void;
    addTeachingUnit: (unit: TeachingUnit) => void;
    removeTeachingUnit: (id: number) => void;
    updateTeachingUnit: (id: number, unit: TeachingUnit) => void;
    getTeachingUnitByLevel: (levelId: number | null) => TeachingUnit[];
}

export const useTeachingUnitStore = create<useTeachingUnitStore>((set, get) => ({
    teachingUnits: null,
    setTeachingUnits: (units: TeachingUnit[]) => set({ teachingUnits: units }),
    addTeachingUnit: (unit: TeachingUnit) => set((state) => ({
        teachingUnits: state.teachingUnits ? [...state.teachingUnits, unit] : [unit]
    })),
    removeTeachingUnit: (id: number) => set((state) => ({
        teachingUnits: state.teachingUnits ? state.teachingUnits.filter(unit => unit.id !== id) : null
    })),
    updateTeachingUnit: (id: number, unit: TeachingUnit) => set((state) => ({
        teachingUnits: state.teachingUnits ? state.teachingUnits.map(existingUnit =>
            existingUnit.id === id ? { ...existingUnit, ...unit } : existingUnit
        ) : null
    })),
    getTeachingUnitByLevel: (levelId: number | null) => {
        const units = get().teachingUnits;
        if (!units) return [];
        if (levelId === null) return [];
        return units.filter(unit => unit.associatedLevels === levelId || unit.associatedLevels === null);
    }
}));
