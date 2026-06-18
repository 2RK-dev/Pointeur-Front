import ScheduleDisplay from "@/app/(Main)/EDT/ui/ScheduleDisplay";
import {DAY_DURATION, DAYS} from "@/Tools/ScheduleItem";

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
			? (differenceEnMinutes / DAY_DURATION) * 100
			: 100;

	const style: React.CSSProperties = {
		flex: `0 0 ${largeurPourcentage}%`,
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
		<div className="border rounded-xl overflow-x-auto bg-card/20 backdrop-blur-sm shadow-sm scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
			<div className="relative min-w-[900px]">
				{/* Timeline Header */}
				<div className="flex border-b h-10 items-center bg-muted/30">
					<div className="w-24 flex-shrink-0 border-r border-muted h-full"></div>
					<div className="flex-1 flex h-full items-center px-1">
						{hours.map((heure, index) => {
							return RenderHours(hours, heure, index);
						})}
					</div>
				</div>

				{/* Days Rows */}
				{DAYS.map(
					(day, index: number) =>
						index > 0 && (
							<div
								key={day}
								className="flex border-b relative hover:bg-muted/5 transition-colors"
							>
								{/* Day Header Column */}
								<div className="w-24 flex-shrink-0 flex flex-col items-center justify-center font-bold border-r border-muted bg-muted/15 text-muted-foreground select-none py-4 text-center">
									<span className="uppercase tracking-wider text-[11px]">{day.substring(0, 3)}</span>
									<span className="text-[9px] font-medium opacity-50">{day}</span>
								</div>

								{/* Grid & Cards Column */}
								<div className="flex-1 relative py-3 px-1 min-h-[80px]">
									{/* Vertical grid lines backdrop */}
									<div className="absolute inset-y-0 left-1 right-1 flex pointer-events-none">
									{hours.map((hour, idx) => {
										if (idx === hours.length - 1) return null;
										const style = getStyleHours(hours, hour, idx);
										return (
												<div
													key={`grid-${idx}`}
													className="border-l border-dashed border-muted/30 h-full shrink-0"
													style={style}
												/>
											);
										})}
									</div>

									{/* Schedule items */}
									<div className="relative z-10 h-full">
										<ScheduleDisplay
											jourIndex={index}
										/>
									</div>
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
			className="relative h-full shrink-0"
			style={style}>
			<div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground z-10 px-1">
				{hour}
			</div>
			<div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground z-10 px-1">
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
		<div key={`heure-${index}`} className="relative h-full shrink-0" style={style}>
			<div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground z-10 px-1">
				{hour}
			</div>
		</div>
	);
};

//#endregion
