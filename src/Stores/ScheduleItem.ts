import { create } from 'zustand'
import {ScheduleItem} from "@/Types/ScheduleItem";
import {Group} from "@/Types/Group";

interface currentScheduleItemsInterface {
    currentScheduleItems: ScheduleItem[];
    setCurrentScheduleItems: (items: ScheduleItem[]) => void;
    addScheduleItem: (item: ScheduleItem) => void;
    removeScheduleItem: (id: number) => void;
    updateScheduleItem: (id: number, item: ScheduleItem) => void;
}

export const useCurrentScheduleItemsStore = create<currentScheduleItemsInterface>((set) => ({
    currentScheduleItems: [],
    setCurrentScheduleItems: (items: ScheduleItem[]) => set({ currentScheduleItems: items }),
    addScheduleItem: (item: ScheduleItem) => set((state) => ({
        currentScheduleItems: [...state.currentScheduleItems, item]
    })),
    removeScheduleItem: (id: number) => set((state) => ({
        currentScheduleItems: state.currentScheduleItems.filter(item => item.id !== id)
    })),
    updateScheduleItem: (id: number, item: ScheduleItem) => set((state) => ({
        currentScheduleItems: state.currentScheduleItems.map(existingItem =>
            existingItem.id === id ? { ...existingItem, ...item } : existingItem
        )
    }))
}));

interface ScheduleItemByLevelStore {
    scheduleItemsByLevel: ScheduleItem[];
    setScheduleItemsByLevel: (groups: Group[], items: ScheduleItem[]) => void;
}

export const useScheduleItemByLevelStore = create<ScheduleItemByLevelStore>((set) => ({
    scheduleItemsByLevel: [],
    setScheduleItemsByLevel: (groups: Group[], items: ScheduleItem[]) => {
        const filteredItems = items.filter(item => item.Groups.some(group => groups.some(g => g.id === group.id)));
        set({ scheduleItemsByLevel: filteredItems });
    }
}));