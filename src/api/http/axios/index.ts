import axios from 'axios';
import { IUserInfo } from "@/api/types";
import { Auth } from "./interceptors/auth/abstract-auth";
import { ServerAuth } from "./interceptors/auth/next-auth";
import { CookieInterceptor } from "@/api/http/axios/interceptors/next-cookies";

const pub = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
});

const authWrapper: Auth = new ServerAuth();

new CookieInterceptor().apply(pub);
authWrapper.apply(pub);

async function initializeAuth (): Promise<IUserInfo | null> {
    try {
        const {access_token, user} = await authWrapper.refresh(pub);
        console.info("[InitializeAuth] active session found");
        await authWrapper.setAccessToken(access_token);
        return user;
    } catch (e) {
        console.info("[InitializeAuth] no active session");
        return null;
    }
}

export const http = {
    pub,
    initializeAuth,
    setAccessToken: (token: string | null) => authWrapper.setAccessToken(token),
};