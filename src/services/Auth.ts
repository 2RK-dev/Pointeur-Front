"use server";

import { Credentials, User } from "@/Types/auth";
import { login as apiLogin, logout as apiLogout } from "@/api/http/auth";
import { http } from "@/api/http/axios";

export async function login (credentials: Credentials): Promise<User> {
    const {user} = await apiLogin(credentials);
    return user;
}

/**
 * Logs out the current user by clearing the session state on the server.
 * @returns {Promise<void>} Resolves when the logout process is complete.
 * @sideEffect Clears authentication/session state.
 */
export async function logout (): Promise<void> {
    await apiLogout();
}

/**
 * Initializes authentication by checking the current session and returning the authenticated user if available.
 * @returns {Promise<User | null>} The authenticated user object if logged in, or null if not authenticated.
 * @sideEffect May trigger session validation on the server.
 */
export async function initializeAuth (): Promise<User | null> {
    return await http.initializeAuth();
}