import { ScheduleItem } from "@/Types/ScheduleItem";
import { getWidthPercentage } from "@/Tools/ScheduleItem";
import { getColorGroups } from "@/Tools/Color";
import {
	useDisplayScheduleItem,
	useOpenScheduleItemFormStore,
	useSelectedScheduleItemStore
} from "@/Stores/ScheduleItem";

interface Props {
	scheduleItem: ScheduleItem;
	left: number;
}

export default function ScheduleItemCard({ scheduleItem, left }: Props) {
	const displayMode = useDisplayScheduleItem((s) => s.displayMode);
	const setSelectedScheduleItem = useSelectedScheduleItemStore((s) => s.setSelectedScheduleItem);
	const setOpen = useOpenScheduleItemFormStore((s) => s.setOpen);

	const width = getWidthPercentage(scheduleItem.startTime, scheduleItem.endTime);

	const UpdateScheduleItem = () => {
		setSelectedScheduleItem(scheduleItem);
		setOpen(true);
	};

	const getDisplayModeLabel = () => {
		switch (displayMode) {
			case 'Student':
				return scheduleItem.Room ? `${scheduleItem.Room.abr} - ${scheduleItem.Teacher.abr}` : `${scheduleItem.Teacher.abr}`;
			case 'Teacher':
				return scheduleItem.Room ? `${scheduleItem.Groups[0].levelAbr} - ${scheduleItem.Room.abr}` : `${scheduleItem.Groups[0].levelAbr}`;
			case 'Room':
				return scheduleItem.Teacher ? `${scheduleItem.Groups[0].levelAbr} - ${scheduleItem.Teacher.abr}` : `${scheduleItem.Groups[0].levelAbr}`;
			default:
				return '';
		}
	};
	const formattedStartTime = scheduleItem.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
	const formattedEndTime = scheduleItem.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
	const groupsString = scheduleItem.Groups.map((g) => g.type + " " + g.classe + " " + g.name).join(", ");

	return (
		<div
			onClick={UpdateScheduleItem}
			className={`
				group relative flex flex-col p-2 rounded-md shadow-sm border border-black/10
				cursor-pointer overflow-hidden transition-all duration-200 ease-in-out
				hover:shadow-md hover:scale-[1.02] hover:z-10 hover:brightness-105
				${getColorGroups(scheduleItem.Groups)}
			`}
			style={{
				flexBasis: `${width}%`,
				marginLeft: `${left}%`,
				flexGrow: 0,
				flexShrink: 0,
			}}
			title="Cliquez pour modifier"
		>
			<div className="flex justify-between items-start gap-2 mb-1">
				<span className="font-bold text-[12px] leading-tight truncate">
					{scheduleItem.TeachingUnit.abr}
				</span>
				<span className="font-semibold text-[11px] opacity-80 whitespace-nowrap bg-black/5 px-1 rounded">
					{getDisplayModeLabel()}
				</span>
			</div>
			<div className="flex items-center text-[11px] font-medium opacity-90 mb-1">
				<svg className="w-3 h-3 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				{formattedStartTime} - {formattedEndTime}
			</div>
			<div className="mt-auto pt-1 text-[10px] border-t border-black/10 opacity-80 truncate">
				<span className="font-semibold">Grp :</span> {groupsString}
			</div>
		</div>
	);
}