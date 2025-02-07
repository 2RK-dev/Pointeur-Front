import {
	BASE_SLOT_HEIGHT,
	calculatePosition,
	calculateWidth,
	formatDuration,
	generateColorByGroup,
	hourly,
} from "@/lib/edt_utils";

interface HoraireCardProps {
	horaire: hourly;
	onEdit: (horaire: hourly) => void;
	top: number; // Nouvelle prop pour la position verticale
}

export default function HoraireCard({
	horaire,
	onEdit,
	top,
}: HoraireCardProps) {
	try {
		const left = calculatePosition(horaire.start_hours);
		const width = calculateWidth(horaire.start_hours, horaire.end_hours);
	} catch (error) {
		console.log(horaire);
	}

	const left = calculatePosition(horaire.start_hours);
	const width = calculateWidth(horaire.start_hours, horaire.end_hours);

	return (
		<div
			key={horaire.id}
			className={`absolute border rounded p-1 text-xs cursor-pointer  ${generateColorByGroup(
				horaire.level.split(" ").slice(1).join(" ")
			)}`}
			style={{
				left: `${left}%`,
				width: `${width}%`,
				height: `${BASE_SLOT_HEIGHT}px`,
				top: `${top}px`,
			}}
			onClick={() => onEdit(horaire)}>
			<div className="font-semibold">{horaire.ue}</div>
			<div className="text-[10px]">
				{horaire.level}
				<br />
				{horaire.teacher} - {horaire.room_abr}
				<br />
				{horaire.start_hours} - {horaire.end_hours}
				<br />
				{formatDuration(horaire.start_hours, horaire.end_hours)}
			</div>
		</div>
	);
}
