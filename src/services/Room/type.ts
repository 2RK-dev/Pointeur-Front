import { Room } from "@/Types/Room";

/**
 * Room Service Type Definition.
 * This interface defines the functions to be exported by all the Room Service implementations.
 * Services should only export functions.
 */
export type IRoomService = {
    getRooms(): Promise<Room[]>
}