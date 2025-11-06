import {Room} from "@/Types/Room";
import {create} from "zustand";

interface RoomsStoreInterface {
    rooms: Room[] | null;
    setRooms: (rooms: Room[]) => void;
    addRoom: (room: Room) => void;
    updateRoom: (id: number, room: Room) => void;
    removeRoom: (id: number) => void;
}

export const useRoomsStore = create<RoomsStoreInterface>((set) => ({
    rooms: null,
    setRooms: (rooms: Room[]) => set({ rooms }),
    addRoom: (room: Room) => set((state) => ({ rooms: state.rooms ? [...state.rooms, room] : [room] })),
    updateRoom: (id: number, updatedRoom: Room) => set((state) => ({
        rooms: state.rooms ? state.rooms.map(room => room.id === id ? updatedRoom : room) : null
    })),
    removeRoom: (id: number) => set((state) => ({
        rooms: state.rooms ? state.rooms.filter(room => room.id !== id) : null
    })),
}));

