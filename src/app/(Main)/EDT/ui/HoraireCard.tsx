import {
	BASE_SLOT_HEIGHT,
	Horaire,
	calculatePosition,
	calculateWidth,
	formatDuration,
	generateColorByGroup,
} from "@/lib/edt_utils";

interface HoraireCardProps {
	horaire: Horaire;
	onEdit: (horaire: Horaire) => void;
	top: number; // Nouvelle prop pour la position verticale
}

export default function HoraireCard({
	horaire,
	onEdit,
	top,
}: HoraireCardProps) {
	try {
		const left = calculatePosition(horaire.heure_debut);
		const width = calculateWidth(horaire.heure_debut, horaire.heure_fin);
	} catch (error) {
		console.log(horaire);
	}

	const left = calculatePosition(horaire.heure_debut);
	const width = calculateWidth(horaire.heure_debut, horaire.heure_fin);

	return (
		<div
			key={horaire.id}
			className={`absolute border rounded p-1 text-xs cursor-pointer  ${generateColorByGroup(
				horaire.id_grp.split(" ").slice(1).join(" ")
			)}`}
			style={{
				left: `${left}%`,
				width: `${width}%`,
				height: `${BASE_SLOT_HEIGHT}px`,
				top: `${top}px`, // Utilisation du `top` passé par le parent
			}}
			onClick={() => onEdit(horaire)}>
			<div className="font-semibold">{horaire.id_ue}</div>
			<div className="text-[10px]">
				{horaire.id_grp}
				<br />
				{horaire.id_prof} - {horaire.id_salle}
				<br />
				{horaire.heure_debut} - {horaire.heure_fin}
				<br />
				{formatDuration(horaire.heure_debut, horaire.heure_fin)}
			</div>
		</div>
	);
}
