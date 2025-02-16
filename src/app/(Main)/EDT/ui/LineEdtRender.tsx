import {
	BASE_SLOT_HEIGHT,
	calculateRowAssignments,
	calculateRowIndex,
	hourly,
} from "@/lib/edt_utils";

import { getDayNumber } from "@/lib/common/dateUtils";
import HourlyCard from "./HourlyCard";

interface RenderHorairesProps {
	hourly: hourly[];
	onEdit: (horaire: hourly) => void; // Fonction de gestion des clics pour l'édition
	jourIndex: number;
}

function RenderHoraires({ hourly, onEdit, jourIndex }: RenderHorairesProps) {
	const joursHoraires: hourly[] = hourly?.filter(
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
					<HourlyCard
						key={horaire.edt_id}
						hourly={horaire}
						onEdit={onEdit}
						top={top}
					/>
				);
			})}
		</div>
	);
}

export default RenderHoraires;
