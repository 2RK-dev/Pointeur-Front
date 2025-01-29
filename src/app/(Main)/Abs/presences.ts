export interface Presence {
	matricule: string;
	nom: string;
	niveau: string;
	matiere: string;
	jour: string;
	heureDebut: string;
	heureFin: string;
	semaine: number;
	statut: "present" | "absent" | "retard";
}

const genererPresencesAleatoires = (): Presence[] => {
	const presences: Presence[] = [];
	const niveaux = ["L1", "L2", "L3", "M1", "M2"];
	const matieres = [
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
	const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
	const statuts: ("present" | "absent" | "retard")[] = [
		"present",
		"absent",
		"retard",
	];
	const heures = ["08:00-10:00", "10:00-12:00", "14:00-16:00", "16:00-18:00"];

	for (let semaine = 1; semaine <= 52; semaine++) {
		for (const jour of jours) {
			for (const niveau of niveaux) {
				const matieresJour = matieres.slice(
					0,
					Math.floor(Math.random() * 5) + 1
				); // 1 à 5 matières par jour
				for (const matiere of matieresJour) {
					const heuresMatiere = heures.slice(
						0,
						Math.floor(Math.random() * 5) + 1
					); // 1 à 5 créneaux par matière
					for (const heure of heuresMatiere) {
						const [heureDebut, heureFin] = heure.split("-");
						for (let i = 0; i < 10; i++) {
							// 10 étudiants par niveau
							presences.push({
								matricule: `MAT${niveau}${1000 + i}`,
								nom: `Étudiant ${niveau}-${i + 1}`,
								niveau,
								matiere,
								jour,
								heureDebut,
								heureFin,
								semaine,
								statut: statuts[Math.floor(Math.random() * statuts.length)],
							});
						}
					}
				}
			}
		}
	}

	return presences;
};

export const presencesData = genererPresencesAleatoires();
