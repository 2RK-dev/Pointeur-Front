import {
	BASE_SLOT_HEIGHT,
	getDayNumber,
	hourly,
	timeToMinutes,
} from "@/lib/edt_utils";

import HoraireCard from "./HoraireCard";

interface RenderHorairesProps {
	horaires: hourly[];
	onEdit: (horaire: hourly) => void; // Fonction de gestion des clics pour l'édition
	jourIndex: number;
}

function isOverlapping(horaire1: hourly, horaire2: hourly): boolean {
	const [start1, end1] = [
		timeToMinutes(horaire1.start_hours),
		timeToMinutes(horaire1.end_hours),
	];
	const [start2, end2] = [
		timeToMinutes(horaire2.start_hours),
		timeToMinutes(horaire2.end_hours),
	];
	return !(end1 <= start2 || start1 >= end2);
}

function calculateRowIndex(
	rowAssignments: Record<number, hourly[]>,
	horaire: hourly
): number {
	return Object.keys(rowAssignments).findIndex((key) =>
		rowAssignments[parseInt(key)].includes(horaire)
	);
}

export function calculateRowAssignments(horaires: hourly[]) {
	const rows: Record<number, hourly[]> = {};

	// Tri des horaires
	horaires.sort(
		(a, b) => timeToMinutes(a.start_hours) - timeToMinutes(b.end_hours)
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
		(hourly) => getDayNumber(hourly.date) === jourIndex
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
