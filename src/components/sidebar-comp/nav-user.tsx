"use client";

import { Button } from "@/components/ui/button";
import { BadgeCheck, LogOut, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingModal from "../LoadingModal";
import { logout } from "@/services/Auth";
import { useAuthStore } from "@/Stores/Auth";

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email?: string;
		avatar: string;
	};
}) {
	const router = useRouter();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
    const {setUser} = useAuthStore();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        logout().then(() => {
            setIsLoggingOut(false);
            setUser(null);
        }).catch(() => {
            setIsLoggingOut(false);
            console.error("Logout failed");
        })
    }

    return (
		<DropdownMenu>
			<LoadingModal isLoading={isLoggingOut} msg="Déconnexion..." />
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="w-full justify-start gap-2">
					<Avatar className="max-h-8 max-w-8">
						<AvatarImage src={user.avatar} alt={"username"} />
						<AvatarFallback>
							{user.name.charAt(0).toLocaleUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col items-start text-left">
						<span className="text-sm font-medium">{user.name}</span>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{user.name}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push("/account")}>
					<BadgeCheck className="mr-2 h-4 w-4" />
					<span>Account</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => router.push("/upgrade")}>
					<Sparkles className="mr-2 h-4 w-4" />
					<span>Upgrade to Pro</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={handleLogout}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
