"use client";

import { toast } from "@/components/ui/use-toast";

export function Notif() {
	const NotificationSuccessAdd = (id: string) => {
		toast({
			variant: "default",
			title: "Ajout reussi",
			description: id + " ajouter avec succes",
		});
	};
	const NotificationSuccessUpdate = (id: string) => {
		toast({
			variant: "default",
			title: "Mofication reussi",
			description: id + " modifier avec succes",
		});
	};
	const NotificationSuccessDelete = (id: string) => {
		toast({
			variant: "default",
			title: "Suppression reussi",
			description: id + " supprimer avec succes",
		});
	};
	const NotificationError = (Msg: string) => {
		toast({
			variant: "destructive",
			title: "Erreur",
			description: Msg,
		});
	};
	return {
		NotificationSuccessAdd,
		NotificationSuccessUpdate,
		NotificationError,
		NotificationSuccessDelete,
	};
}
