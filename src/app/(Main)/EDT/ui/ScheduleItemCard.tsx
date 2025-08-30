import {ScheduleItem} from "@/Types/ScheduleItem";
import {getWidthPercentage} from "@/Tools/ScheduleItem";
import {getColorGroups} from "@/Tools/Color";


interface Props {
	scheduleItem: ScheduleItem;
	left: number;
}

export default function ScheduleItemCard({ scheduleItem,left }: Props) {
	const width = getWidthPercentage(scheduleItem.startTime, scheduleItem.endTime);

	return (
		<div
			className={`border p-1 rounded shadow-sm text-xs overflow-hidden ${getColorGroups(scheduleItem.Groups)}`}

			style={{
				flexBasis: `${width}%`,
				marginLeft: `${left}%`,
				flexGrow: 0,
				flexShrink: 0,
			}}
		>
			<div className="text-[10px] whitespace-normal leading-tight">
				<span>{scheduleItem.TeachingUnit.abr}</span>
				<br/>
				{scheduleItem.Room.abr} — {scheduleItem.Teacher.abr}
				<br />
				{scheduleItem.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -&nbsp;
				{scheduleItem.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
				<br />
				<span>Groupes :</span>{" "}
				{scheduleItem.Groups.map((g) => g.abr).join(", ")}
			</div>
		</div>
	);
}
