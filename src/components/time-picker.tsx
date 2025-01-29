import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import React from "react";

interface TimePickerProps {
	value: string;
	onChange: (time: string) => void;
	minTime?: string;
	maxTime?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
	value,
	onChange,
	minTime = "07:00",
	maxTime = "18:00",
}) => {
	const generateTimeOptions = () => {
		const times: string[] = [];
		const [minHour, minMinute] = minTime.split(":").map(Number);
		const [maxHour, maxMinute] = maxTime.split(":").map(Number);

		for (let hour = minHour; hour <= maxHour; hour++) {
			for (let minute = 0; minute < 60; minute += 15) {
				// Exclure les options en dehors des plages minTime et maxTime
				if (hour === minHour && minute < minMinute) continue;
				if (hour === maxHour && minute > maxMinute) continue;

				// Ajouter l'heure formatée à la liste
				const timeString = `${hour.toString().padStart(2, "0")}:${minute
					.toString()
					.padStart(2, "0")}`;
				times.push(timeString);
			}
		}

		return times;
	};

	const timeOptions = generateTimeOptions();

	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Sélectionner l'heure" />
			</SelectTrigger>
			<SelectContent className="max-h-[280px]">
				{timeOptions.map((time) => (
					<SelectItem key={time} value={time}>
						{time}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default TimePicker;
