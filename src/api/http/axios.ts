import axios from 'axios';
import { DTO } from "@/api/schemas";
import { ILoginResponse, IUserInfo } from "@/api/types";

let accessToken: string | null = null;
let refreshPromise: Promise<void> | null = null;
let loggedIn: boolean = false;

const PUBLIC_ENDPOINTS: string[] = [
    "/auth/login",
    "/auth/logout",
    "/auth/refresh"
];

const isPublicEndpoint = (url: string | undefined) => {
    return url && PUBLIC_ENDPOINTS.some(endpoint => url.startsWith(endpoint));
};

/**
 * @param token if null, sets the auth state as logged out
 */
const setAccessToken = (token: string | null) => {
    loggedIn = !!token;
    accessToken = token;
}

const pub = axios.create({
    baseURL: process.env.API_BASE_URL,
    withCredentials: true,
});

async function refreshAccessToken (): Promise<ILoginResponse> {
    try {
        const {data: responseData} = await pub.post("/auth/refresh");
        return DTO.LoginResponseSchema.parse(responseData);
    } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status == 401) {
            console.info("Session expired, needs re-login");
            loggedIn = false;
            throw new Error("SESSION_EXPIRED");
        } else throw e;
    }
}

pub.interceptors.request.use(config => {
    if (config.url
        && !isPublicEndpoint(config.url)
        && !loggedIn
    ) throw Error("SESSION_EXPIRED");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
});

pub.interceptors.response.use(reponse => reponse, async error => {
    if (axios.isAxiosError(error) && error.response?.status == 401 && error.config && !isPublicEndpoint(error.config.url)) {
        let originalRequest = error.config;
        if (!originalRequest.is_a_retry) {
            if (!refreshPromise) {
                console.info("Access token may have expired, refreshing...");
                refreshPromise = refreshAccessToken()
                    .then((loginResponse) => {
                        console.info("Access token successfully refreshed!")
                        setAccessToken(loginResponse.access_token);
                    })
                    .finally(() => refreshPromise = null);
            } else {
                console.info("Access token refreshing is ongoing...");
            }
            await refreshPromise;
            originalRequest.is_a_retry = true;
            if (originalRequest) return await pub(originalRequest);
        } else return Promise.reject(error);
    } else return Promise.reject(error);
});

async function initializeAuth (): Promise<IUserInfo | null> {
    try {
        const {access_token, user} = await refreshAccessToken();
        console.info("[InitializeAuth] active session found");
        setAccessToken(access_token);
        return user;
    } catch (e) {
        console.info("[InitializeAuth] no active session");
        return null;
    }
}

export const http = {pub, setAccessToken, initializeAuth};