"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/Stores/Auth";
import React, { useEffect } from "react";
import { initializeAuth } from "@/services/Auth";
import LoadingModal from "@/components/LoadingModal";

export const AuthProvider = ({children}: Readonly<{
    children: React.ReactNode;
}>) => {
    const router = useRouter();
    const pathname = usePathname();
    const {initialized, setInitialized, setUser} = useAuthStore();

    useEffect(() => {
        if (initialized) return;

        initializeAuth()
            .then(user => {
                setInitialized(true);
                if (user) {
                    setUser(user);
                } else if (pathname !== "/auth/login") {
                    router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
                }
            })
            .catch(error => {
                console.error('Auth initialization failed:', error);
                setInitialized(true);
            });
    }, [initialized, pathname, router, setInitialized, setUser]);

    return !initialized ? <LoadingModal isLoading={true} msg={"Loading..."}/> : <>{children}</>;

};