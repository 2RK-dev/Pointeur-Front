import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/services/Auth";
import { useAuthStore } from "@/Stores/Auth";
import { useToast } from "@/hooks/use-toast";

export function useAuthActions() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const { setUser } = useAuthStore();
    const { toast } = useToast();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            setUser(null);
            router.push("/auth/login");
        } catch (error) {
            console.error("Logout failed:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "La déconnexion a échoué",
            });
        } finally {
            setIsLoggingOut(false);
        }
    };

    return { isLoggingOut, handleLogout };
}