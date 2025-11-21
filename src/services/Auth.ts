"use server";

import { Credentials, User } from "@/Types/auth";
import {login as apiLogin, logout as apiLogout} from "@/api/http/auth";
import { http } from "@/api/http/axios";

export async function login (credentials: Credentials): Promise<User> {
    const {user} = await apiLogin(credentials);
    return user;
}

export async function logout () {
    await apiLogout();
}

export async function initializeAuth (): Promise<User | null> {
    return await http.initializeAuth();
}