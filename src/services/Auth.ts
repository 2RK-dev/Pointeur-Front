"use server";

import { Credentials, User } from "@/Types/auth";
import {login as apiLogin} from "@/api/http/auth";

export async function login (credentials: Credentials): Promise<User> {
    const {user} = await apiLogin(credentials);
    return user;
}