"use client";

import { Button } from "@/components/ui/button";
import { BadgeCheck, LogOut, Sparkles, Eye, EyeOff } from "lucide-react";

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
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {changeProfilePasswordService} from "@/services/profil";
import { useToast } from "@/hooks/use-toast";

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
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const { setUser } = useAuthStore();
	const { toast } = useToast();

	const [open, setOpen] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleOpenDialog = () => {
		setOpen(true);
		resetPasswordForm();
	};

	const resetPasswordForm = () => {
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setShowCurrentPassword(false);
		setShowNewPassword(false);
		setShowConfirmPassword(false);
	};

	const handleCloseDialog = () => {
		setOpen(false);
		resetPasswordForm();
	};

	const validatePasswordForm = (): string | null => {
		if (!currentPassword.trim()) {
			return "Le mot de passe actuel est requis";
		}
		if (!newPassword.trim()) {
			return "Le nouveau mot de passe est requis";
		}
		if (newPassword.length < 6) {
			return "Le nouveau mot de passe doit contenir au moins 6 caractères";
		}
		if (newPassword === currentPassword) {
			return "Le nouveau mot de passe doit être différent de l'ancien";
		}
		if (newPassword !== confirmPassword) {
			return "Les mots de passe ne correspondent pas";
		}
		return null;
	};

	const handleChangePassword = async () => {
		const validationError = validatePasswordForm();
		if (validationError) {
			toast({
				variant: "destructive",
				title: "Erreur de validation",
				description: validationError,
			});
			return;
		}

		setIsChangingPassword(true);
		try {
			await changeProfilePasswordService(currentPassword, newPassword);
			toast({
				title: "Succès",
				description: "Votre mot de passe a été modifié avec succès",
			});
			handleCloseDialog();
		} catch (error) {
			console.error("Password change failed:", error);
			toast({
				variant: "destructive",
				title: "Erreur",
				description: error instanceof Error ? error.message : "La modification du mot de passe a échoué",
			});
		} finally {
			setIsChangingPassword(false);
		}
	};

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

	return (
		<>
			<LoadingModal isLoading={isLoggingOut} msg="Déconnexion..." />
			<LoadingModal isLoading={isChangingPassword} msg="Modification en cours..." />

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="w-full justify-start gap-2">
						<Avatar className="max-h-8 max-w-8">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback>
								{user.name.charAt(0).toLocaleUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col items-start text-left">
							<span className="text-sm font-medium">{user.name}</span>
							{user.email && (
								<span className="text-xs text-muted-foreground">{user.email}</span>
							)}
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{user.name}</p>
							{user.email && (
								<p className="text-xs leading-none text-muted-foreground">
									{user.email}
								</p>
							)}
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => router.push("/account")}>
						<BadgeCheck className="mr-2 h-4 w-4" />
						<span>Mon compte</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleOpenDialog}>
						<Sparkles className="mr-2 h-4 w-4" />
						<span>Modifier le mot de passe</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Se déconnecter</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={open} onOpenChange={handleCloseDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Modifier le mot de passe</DialogTitle>
						<DialogDescription>
							Entrez votre mot de passe actuel et choisissez un nouveau mot de passe.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">

						<div className="grid gap-2">
							<Label htmlFor="new-password">Nouveau mot de passe</Label>
							<div className="relative">
								<Input
									id="new-password"
									type={showNewPassword ? "text" : "password"}
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									placeholder="Entrez le nouveau mot de passe"
									className="pr-10"
									disabled={isChangingPassword}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setShowNewPassword(!showNewPassword)}
									disabled={isChangingPassword}
								>
									{showNewPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
							<div className="relative">
								<Input
									id="confirm-password"
									type={showConfirmPassword ? "text" : "password"}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Confirmez le nouveau mot de passe"
									className="pr-10"
									disabled={isChangingPassword}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleChangePassword();
										}
									}}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									disabled={isChangingPassword}
								>
									{showConfirmPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleCloseDialog}
							disabled={isChangingPassword}
						>
							Annuler
						</Button>
						<Button
							type="button"
							onClick={handleChangePassword}
							disabled={isChangingPassword}
						>
							{isChangingPassword ? "Modification..." : "Modifier"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
