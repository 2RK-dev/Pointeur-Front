import { timeToMinutes } from "./utils";

export interface Horaire {
	id: string;
	id_grp: string;
	jour: number;
	heure_debut: string;
	heure_fin: string;
	id_ue: string;
	id_salle: string;
	id_prof: string;
	semaine: number;
}

export const BASE_SLOT_HEIGHT = 90;
export const days: string[] = [
	"Lundi",
	"Mardi",
	"Mercredi",
	"Jeudi",
	"Vendredi",
	"Samedi",
];
export const hours = [
	"7:00",
	"8:00",
	"10:00",
	"12:00",
	"14:00",
	"16:00",
	"18:00",
];

export const groupes: { [key: string]: string[] } = {
	L1: ["grp1", "grp2", "grp3", "grp4", "grp5", "grp6"],
	L2: ["grp3", "grp4"],
	L3: ["grp5", "grp6"],
};

export const ue: string[] = [
	"IA",
	"Algorithme",
	"Algorithme Avc",
	"Anglais",
	"Java",
	"Python",
	"Architecture Ordinateur",
	"Architecture Logiciel",
	"Design Pattern",
];

export const initialHoraire: Horaire = {
	id: "",
	id_grp: groupes.L1[0],
	jour: 0,
	heure_debut: "07:00",
	heure_fin: "08:00",
	id_ue: "",
	id_salle: "",
	id_prof: "",
	semaine: 1,
};

export const getStyleHours = (
	hours: string[],
	heure: string,
	index: number
) => {
	const minutesActuelles = timeToMinutes(heure);
	const minutesSuivantes =
		index < hours.length - 1 ? timeToMinutes(hours[index + 1]) : null;

	const differenceEnMinutes =
		minutesSuivantes !== null ? minutesSuivantes - minutesActuelles : null;

	const largeurPourcentage =
		differenceEnMinutes !== null
			? Math.min((differenceEnMinutes / 120) * 100, 100)
			: 100;

	const style: React.CSSProperties = {
		flexBasis: `${largeurPourcentage}%`,
	};
	return style;
};
