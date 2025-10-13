import {ScheduleItem} from "@/Types/ScheduleItem";
import {getWidthPercentage} from "@/Tools/ScheduleItem";
import {getColorGroups} from "@/Tools/Color";
import {
	useDisplayScheduleItem,
	useOpenScheduleItemFormStore,
	useSelectedScheduleItemStore
} from "@/Stores/ScheduleItem";


interface Props {
	scheduleItem: ScheduleItem;
	left: number;
}

export default function ScheduleItemCard({ scheduleItem,left }: Props) {
	const displayMode = useDisplayScheduleItem((s)=> s.displayMode)
	const setSelectedScheduleItem = useSelectedScheduleItemStore((s) => s.setSelectedScheduleItem);
	const setOpen = useOpenScheduleItemFormStore((s) => s.setOpen);
	const width = getWidthPercentage(scheduleItem.startTime, scheduleItem.endTime);
	const UpdateScheduleItem = () => {
		setSelectedScheduleItem(scheduleItem);
		setOpen(true);
	}

	const getDisplayModeLabel = () =>{
		switch(displayMode){
			case 'Student':
				return scheduleItem.Room ? `${scheduleItem.Room.abr} - ${scheduleItem.Teacher.abr}` : `${scheduleItem.Teacher.abr}`;
			case 'Teacher':
				return scheduleItem.Room ? `${scheduleItem.Groups[0].levelName} - ${scheduleItem.Room.abr}` : `${scheduleItem.Groups[0].levelName}`;
			case 'Room':
				return scheduleItem.Teacher ? `${scheduleItem.Groups[0].levelName} - ${scheduleItem.Teacher.abr}` : `${scheduleItem.Groups[0].levelName}`;
			default:
				return '';
		}
	}

	return (
		<div
			className={`border p-1 rounded shadow-sm text-xs overflow-hidden cursor-pointer ${getColorGroups(scheduleItem.Groups)}`}

			style={{
				flexBasis: `${width}%`,
				marginLeft: `${left}%`,
				flexGrow: 0,
				flexShrink: 0,
			}}
		>
			<div onClick={UpdateScheduleItem} className="text-[10px] whitespace-normal leading-tight">
				<span>{scheduleItem.TeachingUnit.abr}</span>
				<br/>
				{getDisplayModeLabel()}
				<br />
				{scheduleItem.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} -&nbsp;
				{scheduleItem.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: false })}
				<br />
				<span>Groupes :</span>{" "}
				{scheduleItem.Groups.map((g) => g.abr).join(", ")}
			</div>
		</div>
	);
}
