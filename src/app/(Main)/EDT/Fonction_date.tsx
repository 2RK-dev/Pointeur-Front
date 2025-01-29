import { Semaine } from "@/app/model";

export function getDayOfWeek(date: Date) {
	const days = [
		"Dimanche",
		"Lundi",
		"Mardi",
		"Mercredi",
		"Jeudi",
		"Vendredi",
		"Samedi",
	];
	return days[date.getDay()];
}

export function obtenirSemaines(): [
	actuelle: Semaine,
	derniere: Semaine,
	prochaine: Semaine
] {
	const maintenant = new Date();
	const jourActuel = maintenant.getDay(); // 0 pour dimanche, 1 pour lundi, etc.

	// Fonction pour ajuster la date à minuit
	function ajusterMinuit(date: Date): Date {
		date.setHours(0, 0, 0, 0);
		return date;
	}

	// Fonction pour obtenir la date du lundi de la semaine contenant la date donnée
	function obtenirLundi(date: Date): Date {
		const diff = date.getDate() - jourActuel + (jourActuel === 0 ? -6 : 1); // Ajustement si dimanche
		return ajusterMinuit(new Date(date.setDate(diff)));
	}

	// Obtenir le lundi de la semaine actuelle
	const lundiActuel = obtenirLundi(new Date(maintenant));

	// Obtenir les dates de début et de fin pour les trois semaines
	const actuelle: Semaine = {
		debut: new Date(lundiActuel),
		fin: new Date(new Date().setDate(lundiActuel.getDate() + 6)),
	};

	const derniere: Semaine = {
		debut: new Date(new Date().setDate(lundiActuel.getDate() - 7)),
		fin: new Date(new Date().setDate(lundiActuel.getDate() - 1)),
	};

	const prochaine: Semaine = {
		debut: new Date(new Date().setDate(lundiActuel.getDate() + 7)),
		fin: new Date(new Date().setDate(lundiActuel.getDate() + 7 + 6)),
	};

	return [derniere, actuelle, prochaine];
}
export function getDateByDayOfWeek(dayOfWeek: string, startDate: Date): string {
	const days = [
		"Dimanche",
		"Lundi",
		"Mardi",
		"Mercredi",
		"Jeudi",
		"Vendredi",
		"Samedi",
	];

	const dayIndex = days.indexOf(dayOfWeek);
	const diff = dayIndex - startDate.getDay();
	const targetDate = new Date(startDate);
	targetDate.setDate(startDate.getDate() + diff);

	return targetDate.toISOString().split("T")[0];
}
