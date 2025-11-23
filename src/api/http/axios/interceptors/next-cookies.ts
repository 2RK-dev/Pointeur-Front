/**
 * Utility to forward cookies from backend to the browser and cookies from the browser to axios requests.
 */

import { cookies } from "next/headers";
import { HttpClientInterceptor } from "./types";
import { AxiosInstance } from "axios";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const FORWARDED = ["refresh_token", "device_id"];

export class CookieInterceptor implements HttpClientInterceptor {
    apply(client: AxiosInstance) {
        // forward cookies from Next to backend
        client.interceptors.request.use(async config => {
            const store = await cookies();
            const cookieHeader = FORWARDED
                .map(n => {
                    const c = store.get(n);
                    return c ? `${n}=${c.value}` : null;
                })
                .filter(Boolean)
                .join("; ");

            if (cookieHeader) {
                config.headers.Cookie = cookieHeader;
            }
            return config;
        });

        // forward cookies from backend to browser
        client.interceptors.response.use(async res => {
            const set = res.headers["set-cookie"];
            if (!set) return res;

            const store = await cookies();
            for (const cookieStr of set) {
                const [pair, ...attrs] = cookieStr.split("; ");
                const [name, value] = pair.split("=");

                if (!FORWARDED.includes(name)) continue;

                const opts: ResponseCookie = {name, value};
                for (const a of attrs) {
                    const [k, v] = a.split("=");
                    const key = k.toLowerCase();
                    if (key === "secure") opts["secure"] = true;
                    else if (key === "httponly") opts.httpOnly = true;
                    else if (key === "path" && v !== undefined) opts.path = v;
                    else if (key === "max-age" && v !== undefined) opts.maxAge = parseInt(v);
                    else if (key === "samesite") {
                        const s = typeof v === "string" ? v.trim().toLowerCase() : "";
                        if (s === "strict" || s === "lax" || s === "none") {
                            opts.sameSite = s as "strict" | "lax" | "none";
                        }
                    }
                }

                store.set(opts);
            }

            return res;
        });
    }

}
