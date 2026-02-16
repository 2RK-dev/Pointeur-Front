"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/Stores/Auth";
import React, { useEffect, useState } from "react";
import { initializeAuth } from "@/services/Auth";
import LoadingModal from "@/components/LoadingModal";

const PUBLIC_PATHS = ["/auth/login"];
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

const isPublicPath = (pathname: string) =>
    PUBLIC_PATHS.some(path => pathname.startsWith(path));

export const AuthProvider = ({children}: Readonly<{
    children: React.ReactNode;
}>) => {
    const router = useRouter();
    const pathname = usePathname();
    const {user, setUser} = useAuthStore();
    const [loading, setLoading] = useState<boolean>(!user);
    const [shouldRender, setShouldRender] = useState<boolean>(false);

    useEffect(() => {
        if (DEV_MODE && !user) {
            setShouldRender(true);
            setLoading(false);
            setUser({
               username: "dev_user",
                role: "admin",
            })
            return;
        }

        if (user) return;

        initializeAuth()
            .then(user => {
                if (user) {
                    setUser(user);
                    setShouldRender(true);
                } else if (!isPublicPath(pathname)) {
                    router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
                    return;
                } else {
                    setShouldRender(true);
                }
            })
            .catch(error => {
                console.error('Auth initialization failed:', error);
                if (!isPublicPath(pathname)) {
                    router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
                    return;
                } else {
                    setShouldRender(true);
                }
            })
            .finally(() => setLoading(false));
    }, [user, setUser, pathname, router]);

    if (loading || !shouldRender) {
        return <LoadingModal isLoading={true} msg="Loading..."/>;
    }

    return <>{children}</>;
};

