import { Auth, RefreshLock } from "./abstract-auth";
import { cookies } from "next/headers";

const refreshLocks = new Map<string, Promise<void>>();

export class ServerAuth extends Auth {

    async getAccessToken(): Promise<string | null> {
        const cookieStore = await cookies();
        return cookieStore.get("access_token")?.value ?? null;
    }

    async setAccessToken(token: string | null): Promise<void> {
        const cookieStore = await cookies();
        if (token) {
            cookieStore.set("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 15
            });
        } else cookieStore.delete("access_token");
    }

    async setLoggedIn(loggedIn: boolean): Promise<void> {
        if (!loggedIn) {
            const cookieStore = await cookies();
            cookieStore.delete("access_token");
        }
    }

    async getRefreshLock(): Promise<RefreshLock | null> {
        const cookieStore = await cookies();
        const deviceId = cookieStore.get("device_id")?.value;
        if (!deviceId) return null;
        const refreshLock = refreshLocks.get(deviceId);
        return refreshLock ? {promise: refreshLock} : null;
    }

    async setRefreshLock(lock: RefreshLock): Promise<void> {
        const cookieStore = await cookies();
        const deviceId = cookieStore.get("device_id")?.value;
        if (deviceId) refreshLocks.set(deviceId, lock.promise);
    }

    async deleteRefreshLock(): Promise<void> {
        const cookieStore = await cookies();
        const deviceId = cookieStore.get("device_id")?.value;
        if (deviceId) refreshLocks.delete(deviceId);
    }
}