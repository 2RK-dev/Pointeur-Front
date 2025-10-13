import {create} from 'zustand'
import {ScheduleItem} from "@/Types/ScheduleItem";
import {Group} from "@/Types/Group";
import {Teacher} from "@/Types/Teacher";
import {Room} from "@/Types/Room";

interface currentScheduleItemsInterface {
    currentScheduleItems: ScheduleItem[];
    setCurrentScheduleItems: (items: ScheduleItem[]) => void;
    addScheduleItem: (item: ScheduleItem) => void;
    removeScheduleItem: (id: number) => void;
    updateScheduleItem: (id: number, item: ScheduleItem) => void;
    getAvailableGroups: (startTime: Date, endTime: Date, currentGroups: Group[], except: ScheduleItem | null) => Group[];
    getAvailableTeachers: (startTime: Date, endTime: Date, currentTeachers: Teacher[], except: ScheduleItem | null) => Teacher[];
    getAvailableRooms: (startTime: Date, endTime: Date, currentRooms: Room[], except: ScheduleItem | null) => Room[];
}

export const useCurrentScheduleItemsStore = create<currentScheduleItemsInterface>((set, get) => ({
    currentScheduleItems: [],
    setCurrentScheduleItems: (items: ScheduleItem[]) => set({currentScheduleItems: items}),
    addScheduleItem: (item: ScheduleItem) => set((state) => ({
        currentScheduleItems: [...state.currentScheduleItems, item]
    })),
    removeScheduleItem: (id: number) => set((state) => ({
        currentScheduleItems: state.currentScheduleItems.filter(item => item.id !== id)
    })),
    updateScheduleItem: (id: number, item: ScheduleItem) => set((state) => ({
        currentScheduleItems: state.currentScheduleItems.map(existingItem =>
            existingItem.id === id ? {...existingItem, ...item} : existingItem
        )
    })),
    getAvailableGroups: (startTime: Date, endTime: Date, currentGroups: Group[], except: ScheduleItem | null) => {
        let scheduleItems = get().currentScheduleItems;
        if (except) {
            scheduleItems = scheduleItems.filter(item => item.id !== except.id);
        }
        const overlappingItems = scheduleItems.filter(item => {
            return item.startTime < endTime && item.endTime > startTime;
        });

        const busyGroupIds = new Set<number>();
        for (const item of overlappingItems) {
            for (const group of item.Groups) {
                busyGroupIds.add(group.id);
            }
        }

        return currentGroups.filter(group => !busyGroupIds.has(group.id));
    },
    getAvailableTeachers: (startTime: Date, endTime: Date, currentTeachers: Teacher[], except: ScheduleItem | null) => {
        let scheduleItems = get().currentScheduleItems;
        if (except) {
            scheduleItems = scheduleItems.filter(item => item.id !== except.id);
        }
        const overlappingItems = scheduleItems.filter(item => {
            return item.startTime < endTime && item.endTime > startTime;
        });

        const busyTeacherIds = new Set<number>();
        for (const item of overlappingItems) {
            if (item.Teacher) {
                busyTeacherIds.add(item.Teacher.id);
            }
        }

        return currentTeachers.filter(teacher => !busyTeacherIds.has(teacher.id));
    },
    getAvailableRooms: (startTime: Date, endTime: Date, currentRooms: Room[], except: ScheduleItem | null) => {
        let scheduleItems = get().currentScheduleItems;
        if (except) {
            scheduleItems = scheduleItems.filter(item => item.id !== except.id);
        }
        const overlappingItems = scheduleItems.filter(item => {
            return item.startTime < endTime && item.endTime > startTime;
        });

        const busyRoomIds = new Set<number>();
        for (const item of overlappingItems) {
            if (item.Room) {
                busyRoomIds.add(item.Room.id);
            }
        }

        return currentRooms.filter(room => !busyRoomIds.has(room.id));
    },
}));

interface DisplayScheduleItem {
    displayScheduleItems: ScheduleItem[];
    displayMode: "Student" | "Teacher" | "Room";
    setScheduleItemsByLevel: (groups: Group[], items: ScheduleItem[]) => void;
    setScheduleItemsByTeacher: (teacherId: number, items: ScheduleItem[]) => void;
    setDisplayMode: (mode: "Student" | "Teacher" | "Room") => void;
}

export const useDisplayScheduleItem = create<DisplayScheduleItem>((set) => ({
    displayScheduleItems: [],
    setScheduleItemsByLevel: (groups: Group[], items: ScheduleItem[]) => {
        const filteredItems = items.filter(item => item.Groups.some(group => groups.some(g => g.id === group.id)));
        set({displayScheduleItems: filteredItems});
    },
    setScheduleItemsByTeacher: (teacherId: number, items: ScheduleItem[]) => {
        const filteredItems = items.filter(item => item.Teacher?.id === teacherId);
        set({displayScheduleItems: filteredItems});
    },
    displayMode: "Student",
    setDisplayMode: (mode) => set({displayMode: mode}),
}));

interface SelectedScheduleItemStore {
    selectedScheduleItem: ScheduleItem | null;
    setSelectedScheduleItem: (item: ScheduleItem | null) => void;
}

export const useSelectedScheduleItemStore = create<SelectedScheduleItemStore>((set) => ({
    selectedScheduleItem: null,
    setSelectedScheduleItem: (item: ScheduleItem | null) => set({selectedScheduleItem: item}),
}));

interface OpenScheduleItemForm {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const useOpenScheduleItemFormStore = create<OpenScheduleItemForm>((set) => ({
    open: false,
    setOpen: (open: boolean) => set({open}),
}));