// @/components/nav-user/nav-user.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, LogOut, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import LoadingModal from "../LoadingModal";
import { ChangePasswordDialog } from "./change-password-form";
import { useAuthActions } from "@/hooks/use-auth-actions";

interface User {
	name: string;
	email?: string;
	avatar: string;
}

export function NavUser({ user }: { user: User }) {
	const router = useRouter();
	const { isLoggingOut, handleLogout } = useAuthActions();
	const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

	return (
		<>
			<LoadingModal isLoading={isLoggingOut} msg="Déconnexion..." />

			<ChangePasswordDialog
				open={isPasswordDialogOpen}
				onOpenChange={setIsPasswordDialogOpen}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2">
						<Avatar className="h-8 w-8">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col items-start text-left truncate">
							<span className="text-sm font-medium truncate w-full">{user.name}</span>
							{user.email && (
								<span className="text-xs text-muted-foreground truncate w-full">
                  {user.email}
                </span>
							)}
						</div>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{user.name}</p>
							<p className="text-xs leading-none text-muted-foreground">{user.email}</p>
						</div>
					</DropdownMenuLabel>

					<DropdownMenuSeparator />

					<DropdownMenuItem onClick={() => router.push("/account")}>
						<BadgeCheck className="mr-2 h-4 w-4" />
						<span>Mon compte</span>
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => setIsPasswordDialogOpen(true)}>
						<Sparkles className="mr-2 h-4 w-4" />
						<span>Modifier le mot de passe</span>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
						<LogOut className="mr-2 h-4 w-4" />
						<span>Se déconnecter</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}