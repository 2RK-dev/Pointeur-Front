import { ScheduleItem } from "@/Types/ScheduleItem";
import { getWidthPercentage } from "@/Tools/ScheduleItem";
import { generateColorFromStrings } from "@/Tools/Color";
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
	const groupsStrings = scheduleItem.Groups.map((g) => g.type+ " " + g.classe+ " " + g.name).join(", ");

	return (
		<div
			onClick={UpdateScheduleItem}
			className={`
				group relative flex flex-col p-1.5 rounded-md shadow-sm border border-black/10
				cursor-pointer transition-all duration-200 ease-in-out
				hover:shadow-md hover:scale-[1.02] hover:z-10 hover:brightness-105
			`}
			style={{
                backgroundColor: generateColorFromStrings(scheduleItem.Groups),
                flexBasis: `${width}%`,
				marginLeft: `${left}%`,
				flexGrow: 0,
				flexShrink: 0,
			}}
		>
			<div className="flex flex-col gap-1 w-full text-black/90 whitespace-normal break-words">

				<div className="leading-tight">
					<div className="font-bold text-[12px]">
						{scheduleItem.TeachingUnit.abr}
					</div>
					<div className="font-semibold text-[11px] opacity-80 mt-0.5 inline-block bg-black/5 px-1 rounded">
						{getDisplayModeLabel()}
					</div>
				</div>

				<div className="text-[11px] font-medium opacity-90 leading-tight">
					{formattedStartTime} - {formattedEndTime}
				</div>

				<div className="mt-auto pt-1 text-[10px] border-t border-black/10 opacity-80 leading-tight">
					<span className="font-semibold">Grp :</span> {groupsStrings}
				</div>

			</div>
		</div>
	);
}