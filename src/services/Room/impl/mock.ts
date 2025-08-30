// noinspection JSUnusedGlobalSymbols

"use server";

import data from "@/test/Room.json";
import { Room } from "@/Types/Room";

export async function getRooms(): Promise<Room[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return data as Room[];
}