import { BASE_SLOT_HEIGHT, Horaire } from "@/lib/edt_utils";
import { timeToMinutes } from "@/lib/utils";
import HoraireCard from "./HoraireCard";

interface RenderHorairesProps {
	horaires: Horaire[];
	onEdit: (horaire: Horaire) => void; // Fonction de gestion des clics pour l'édition
	jourIndex: number;
}

function isOverlapping(horaire1: Horaire, horaire2: Horaire): boolean {
	const [start1, end1] = [
		timeToMinutes(horaire1.heure_debut),
		timeToMinutes(horaire1.heure_fin),
	];
	const [start2, end2] = [
		timeToMinutes(horaire2.heure_debut),
		timeToMinutes(horaire2.heure_fin),
	];
	return !(end1 <= start2 || start1 >= end2);
}

function calculateRowIndex(
	rowAssignments: Record<number, Horaire[]>,
	horaire: Horaire
): number {
	return Object.keys(rowAssignments).findIndex((key) =>
		rowAssignments[parseInt(key)].includes(horaire)
	);
}

export function calculateRowAssignments(horaires: Horaire[]) {
	const rows: Record<number, Horaire[]> = {};

	// Tri des horaires
	horaires.sort(
		(a, b) => timeToMinutes(a.heure_debut) - timeToMinutes(b.heure_debut)
	);

	// Affectation des rangées
	horaires.forEach((horaire) => {
		const assignedRow = Object.keys(rows).find((row) =>
			rows[parseInt(row)].every(
				(existingHoraire) => !isOverlapping(existingHoraire, horaire)
			)
		);

		// Ajouter à une rangée existante ou créer une nouvelle rangée
		const rowIndex = assignedRow
			? parseInt(assignedRow)
			: Object.keys(rows).length;
		rows[rowIndex] = rows[rowIndex] || [];
		rows[rowIndex].push(horaire);
	});

	return { normalRows: rows };
}

function RenderHoraires({ horaires, onEdit, jourIndex }: RenderHorairesProps) {
	const joursHoraires = horaires.filter(
		(horaire) => horaire.jour === jourIndex
	);

	const rowAssignments = calculateRowAssignments(joursHoraires);

	return (
		<div
			className="relative"
			style={{
				height: `${
					Object.values(rowAssignments.normalRows).length * BASE_SLOT_HEIGHT
				}px`,
				minHeight: BASE_SLOT_HEIGHT + "px",
			}}>
			{joursHoraires.map((horaire) => {
				const rowIndex = calculateRowIndex(rowAssignments.normalRows, horaire);
				const top = rowIndex * BASE_SLOT_HEIGHT;

				return (
					<HoraireCard
						key={horaire.id}
						horaire={horaire}
						onEdit={onEdit}
						top={top}
					/>
				);
			})}
		</div>
	);
}

export default RenderHoraires;
