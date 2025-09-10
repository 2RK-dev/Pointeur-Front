import ScheduleDisplay from "@/app/(Main)/EDT/ui/ScheduleDisplay";
import {DAYS} from "@/Tools/ScheduleItem";

export function timeToMinutes(time: string): number {
	const [hours, minutes] = time.split(":").map(Number);
	if (isNaN(hours) || isNaN(minutes)) {
		throw new Error(`Invalid time format: ${time}`);
	}
	return hours * 60 + minutes;
}

const getStyleHours = (
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

export const hours = [
	"7:00",
	"8:00",
	"10:00",
	"12:00",
	"14:00",
	"16:00",
	"18:00",
];

export default function EdtEncapsuler() {

	return (
		<div className="border rounded-lg overflow-x-auto">
			<div className="relative min-w-[800px]">
				<div className="flex border-b h-8">
					<div className="min-w-20 "></div>
					{hours.map((heure, index) => {
						return RenderHours(hours, heure, index);
					})}
				</div>

				{DAYS.map(
					(day, index: number) =>
						index > 0 && (
							<div key={day} className="flex border-b-2 relative">
								<div className="w-20 flex items-center justify-center font-semibold">
									{day}
								</div>
								<div className="flex-1 relative">
									<ScheduleDisplay
										jourIndex={index}
									/>
								</div>
							</div>
						)
				)}
			</div>
		</div>
	);
}

//#region Component
const RenderHours = (hours: string[], heure: string, index: number) => {
	const style = getStyleHours(hours, heure, index);
	if (index === hours.length - 2) {
		return PenultimateHours(heure, index, style);
	}
	if (index === hours.length - 1) {
		return null;
	}
	return NormalHours(heure, index, style);
};

const PenultimateHours = (
	hour: string,
	index: number,
	style: React.CSSProperties
) => {
	return (
		<div
			key={`heure-${index}`}
			className="flex space-x-2 justify-between"
			style={{ ...style }}>
			<div className="text-sm font-semibold" style={{ ...style }}>
				{hour}
			</div>
			<div className="text-sm font-semibold text-end" style={{ ...style }}>
				{hours[index + 1]}
			</div>
		</div>
	);
};

const NormalHours = (
	hour: string,
	index: number,
	style: React.CSSProperties
) => {
	return (
		<div key={`heure-${index}`} className="text-sm font-semibold" style={style}>
			{hour}
		</div>
	);
};

//#endregion
