import {Room} from "@/Types/Room";
import {create} from "zustand";

interface RoomsStoreInterface {
    rooms: Room[];
    setRooms: (rooms: Room[]) => void;
    addRoom: (room: Room) => void;
    updateRoom: (id: number, room: Room) => void;
    removeRoom: (id: number) => void;
}

export const useRoomsStore = create<RoomsStoreInterface>((set) => ({
    rooms: [],
    setRooms: (rooms: Room[]) => set({ rooms }),
    addRoom: (room: Room) => set((state) => ({ rooms: [...state.rooms, room] })),
    updateRoom: (id: number, room: Room) => set((state) => ({
        rooms: state.rooms.map(r => r.id === id ? { ...r, ...room } : r)
    })),
    removeRoom: (id: number) => set((state) => ({
        rooms: state.rooms.filter(r => r.id !== id)
    })),
}));

