import axios, { AxiosInstance } from "axios";
import { HttpClientInterceptor } from "../types";
import { ILoginResponse } from "@/api/types";
import { DTO } from "@/api/schemas";

const PUBLIC_ENDPOINTS: string[] = [
    "/auth/login",
    "/auth/logout",
    "/auth/refresh"
];

const isPublicEndpoint = (url: string | undefined) => {
    return url && PUBLIC_ENDPOINTS.some(endpoint => url.startsWith(endpoint));
};

export interface RefreshLock {
    promise: Promise<void>;
}

export abstract class Auth implements HttpClientInterceptor {

    apply(client: AxiosInstance) {
        client.interceptors.request.use(async (config) => {
            const token = await this.getAccessToken();
            if (token) config.headers.Authorization = `Bearer ${token}`;
            else if (!isPublicEndpoint(config.url))
                throw new Error("SESSION_EXPIRED");
            return config;
        });

        client.interceptors.response.use(
            (res) => res,
            async (err) => {
                if (
                    axios.isAxiosError(err) &&
                    err.response?.status === 401 &&
                    err.config &&
                    !isPublicEndpoint(err.config.url) &&
                    !err.config.is_a_retry
                ) {
                    let lock = await this.getRefreshLock();

                    if (!lock) {
                        console.info("[AUTH] Refreshing...");
                        const promise = this.refresh(client)
                            .then(async ({ access_token }) => {
                                console.info("[AUTH] Refresh success");
                                await this.setAccessToken(access_token);
                            })
                            .finally(() => this.deleteRefreshLock());

                        lock = {promise};
                        await this.setRefreshLock(lock);
                    } else {
                        console.info("[AUTH] Awaiting refresh lock");
                    }

                    await lock.promise;
                    err.config.is_a_retry = true;
                    return client(err.config);
                }
                return Promise.reject(err);
            }
        );
    }

    async refresh(pub: AxiosInstance): Promise<ILoginResponse> {
        try {
            const { data: responseData } = await pub.post("/auth/refresh");
            return DTO.LoginResponseSchema.parse(responseData);
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.status === 401) {
                console.info("Session expired, needs re-login");
                await this.setLoggedIn(false);
                throw new Error("SESSION_EXPIRED");
            }
            throw e;
        }
    }

    abstract getAccessToken(): Promise<string | null>;
    abstract setAccessToken(token: string): Promise<void>;
    abstract setLoggedIn(loggedIn: boolean): Promise<void>;
    abstract getRefreshLock(): Promise<RefreshLock | null>;
    abstract deleteRefreshLock(): Promise<void>;
    abstract setRefreshLock(lock: RefreshLock): Promise<void>;
}