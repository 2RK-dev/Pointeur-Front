import axios from 'axios';
import { DTO } from "@/api/schemas";

let accessToken: string | null = null;
let refreshPromise: Promise<void> | null = null;
let loggedIn: boolean = false;

const PUBLIC_ENDPOINTS: string[] = [
    "/auth/login",
    "/auth/logout",
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

async function refreshAccessToken (): Promise<string> {
    try {
        const {data: responseData} = await pub.post("/auth/refresh");
        return DTO.LoginResponseSchema.parse(responseData).access_token;
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
                    .then((token) => {
                        console.info("Access token successfully refreshed!")
                        setAccessToken(token);
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
})

async function initializeAuth(): Promise<void> {
    try {
        const token = await refreshAccessToken();
        setAccessToken(token);
    } catch (e) {
        console.info("initializeAuth: no active session");
    }
}

export const http = {pub, setAccessToken, initializeAuth};