"use client";

import { sendloginrequest } from "@/app/Servers/login";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "../app/Servers/cookie";

export function useAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// Vérifier si un token existe dans les cookies au montage
		const checkAuth = async () => {
			const token = await getCookie("token");
			setIsAuthenticated(!!token);
			setLoading(false);
		};
		checkAuth();
	}, []);

	const login = async (username: string, password: string) => {
		try {
			const data = await sendloginrequest(username, password);

			if (!data.token) {
				throw new Error("No token in response");
			}
			await setCookie("token", data.token);
			setIsAuthenticated(true);
			toast({
				title: "Login Success",
				description: "You have successfully logged in",
			});
			router.push("http://localhost:3000/Dashboard");
			return true;
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast({
					title: "Login Error",
					description: "An error occurred during login. Please try again.",
					variant: "destructive",
				});
				return false;
			}
		}
	};

	const logout = async () => {
		try {
			await deleteCookie("token"); // Supprimer le cookie token
			setIsAuthenticated(false);
			router.push("http://localhost:3000");
		} catch (error) {
			console.error("Logout failed:", error);
			throw error;
		}
	};
	return { isAuthenticated, loading, login, logout };
}
