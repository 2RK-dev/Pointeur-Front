import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/Auth";
import { useAuthStore } from "@/Stores/Auth";
import {notifications} from "@/components/notifications";

export function useAuthActions() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const { setUser } = useAuthStore();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        logout().then(()=>{
            setUser(null);
            notifications.success("Déconnexion réussie", "Vous avez été déconnecté avec succès");
            router.push("/auth/login");
        }).catch(err=>{
            console.error("Logout failed:", err);
            notifications.error("Erreur", "La déconnexion a échoué");
        }).finally(()=>{
            setIsLoggingOut(false);
        })
    };

    return { isLoggingOut, handleLogout };
}