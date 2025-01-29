import { Horaire } from "@/lib/Model/edt";
import { days, getStyleHours, hours } from "@/lib/edt_utils";
import RenderHoraires from "./LineEdtRender";

interface props {
	horaires: Horaire[];
	onEdit: (horaire: Horaire) => void;
}

export default function EdtEncapsuler({ horaires, onEdit }: props) {
	return (
		<div className="border rounded-lg overflow-x-auto">
			<div className="relative min-w-[800px]">
				<div className="flex border-b h-8">
					<div className="min-w-20 "></div>
					{hours.map((heure, index) => {
						return RenderHours(hours, heure, index);
					})}
				</div>

				{/* for days and hourly */}
				{days.map((day, index: number) => (
					<div key={day} className="flex border-b-2 relative">
						<div className="w-20 flex items-center justify-center font-semibold">
							{day}
						</div>
						<div className="flex-1 relative">
							<RenderHoraires
								horaires={horaires}
								onEdit={onEdit}
								jourIndex={index}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

//sample componant
//#region Componant
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
