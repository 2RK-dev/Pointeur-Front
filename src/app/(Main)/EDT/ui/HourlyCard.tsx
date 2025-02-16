import {
	BASE_SLOT_HEIGHT,
	calculatePosition,
	calculateWidth,
	formatDuration,
	generateColorByGroup,
	hourly,
} from "@/lib/edt_utils";

interface Props {
	hourly: hourly;
	onEdit: (hourly: hourly) => void;
	top: number; // Nouvelle prop pour la position verticale
}

export default function HourlyCard({ hourly, onEdit, top }: Props) {
	const left = calculatePosition(hourly.start_hours);
	const width = calculateWidth(hourly.start_hours, hourly.end_hours);

	return (
		<div
			key={hourly.hourly_id}
			className={`absolute border rounded p-1 text-xs cursor-pointer  ${generateColorByGroup(
				hourly.level.split(" ").slice(1).join(" ")
			)}`}
			style={{
				left: `${left}%`,
				width: `${width}%`,
				height: `${BASE_SLOT_HEIGHT}px`,
				top: `${top}px`,
			}}
			onClick={() => {
				onEdit(hourly);
			}}>
			<div className="font-semibold">{hourly.matter_abr}</div>
			<div className="text-[10px]">
				{hourly.room_abr}
				<br />
				{hourly.teacher} - {hourly.room_abr}
				<br />
				{hourly.start_hours} - {hourly.end_hours}
				<br />
				{formatDuration(hourly.start_hours, hourly.end_hours)}
			</div>
		</div>
	);
}
