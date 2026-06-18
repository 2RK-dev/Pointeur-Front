import { ScheduleItem } from "@/Types/ScheduleItem";
import { getWidthPercentage } from "@/Tools/ScheduleItem";
import { generateColorFromStrings } from "@/Tools/Color";
import { Button } from "@/components/ui/button";
import { Copy, Clock, MapPin, User, Users, GraduationCap } from "lucide-react";
import type { MouseEvent } from "react";
import {
	useCopiedScheduleItemStore,
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
	const setCopiedScheduleItem = useCopiedScheduleItemStore((s) => s.setCopiedScheduleItem);
	const setOpen = useOpenScheduleItemFormStore((s) => s.setOpen);

	const width = getWidthPercentage(scheduleItem.startTime, scheduleItem.endTime);

	const UpdateScheduleItem = () => {
		setCopiedScheduleItem(null);
		setSelectedScheduleItem(scheduleItem);
		setOpen(true);
	};

	const DuplicateScheduleItem = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		setSelectedScheduleItem(null);
		setCopiedScheduleItem(scheduleItem);
		setOpen(true);
	};

	const getDisplayModeLabel = () => {
		switch (displayMode) {
			case 'Student':
				return scheduleItem.Room ? `${scheduleItem.Room.abr} • ${scheduleItem.Teacher.abr}` : `${scheduleItem.Teacher.abr}`;
			case 'Teacher':
				return scheduleItem.Room ? `${scheduleItem.Groups[0].levelAbr} • ${scheduleItem.Room.abr}` : `${scheduleItem.Groups[0].levelAbr}`;
			case 'Room':
				return scheduleItem.Teacher ? `${scheduleItem.Groups[0].levelAbr} • ${scheduleItem.Teacher.abr}` : `${scheduleItem.Groups[0].levelAbr}`;
			default:
				return '';
		}
	};

	const formattedStartTime = scheduleItem.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
	const formattedEndTime = scheduleItem.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

	const groupsArray = scheduleItem.Groups.map((g) => `${g.type} ${g.classe} ${g.name}`);

	const dynamicColor = generateColorFromStrings(scheduleItem.Groups);

	return (
		<div
			onClick={UpdateScheduleItem}
			className="group absolute top-0 flex flex-col p-2.5 rounded-xl border transition-all duration-200 ease-in-out cursor-pointer hover:shadow-md hover:z-10 select-none overflow-hidden h-[105px]"
			style={{
				left: `${left}%`,
				width: `${width}%`,
				borderLeft: `4px solid ${dynamicColor}`,
				backgroundColor: `${dynamicColor}08`,
			}}
		>
			<Button
				type="button"
				variant="secondary"
				size="icon"
				className="absolute right-1 top-1 h-6 w-6 opacity-0 scale-90 transition-all group-hover:opacity-100 group-hover:scale-100 backdrop-blur-sm bg-white/80 dark:bg-black/80 shadow-sm print:hidden"
				onClick={DuplicateScheduleItem}
			>
				<Copy className="h-3 w-3 text-muted-foreground" />
			</Button>

			<div className="flex flex-col justify-between h-full w-full text-slate-700 dark:text-slate-200 text-left">

				<div className="space-y-1">
					<div className="pr-5">
						<h4 className="font-bold text-[13px] tracking-tight text-slate-900 dark:text-white line-clamp-1 leading-none">
							{scheduleItem.TeachingUnit.abr}
						</h4>
					</div>

					<div className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 py-0.5 px-1.5 rounded w-fit">
						{displayMode === 'Student' && <MapPin className="h-2.5 w-2.5 text-slate-500" />}
						{displayMode === 'Teacher' && <Users className="h-2.5 w-2.5 text-slate-500" />}
						{displayMode === 'Room' && <User className="h-2.5 w-2.5 text-slate-500" />}
						<span className="truncate">{getDisplayModeLabel()}</span>
					</div>
				</div>

				<div className="space-y-1.5">
					<div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 leading-none">
						<Clock className="h-3 w-3 text-slate-500" />
						<span>{formattedStartTime} - {formattedEndTime}</span>
					</div>

					<div className="flex items-center gap-1 border-t border-slate-200/60 dark:border-slate-700/60 pt-1.5 overflow-hidden">
						<GraduationCap className="h-3 w-3 text-slate-400 flex-shrink-0" />
						<div className="flex gap-1 overflow-hidden truncate mask-linear-gradient w-full">
							{groupsArray.map((group, index) => (
								<span
									key={index}
									className="text-[9px] font-bold tracking-wide uppercase px-1 py-0.5 bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded flex-shrink-0"
								>
                            {group}
                         </span>
							))}
						</div>
					</div>
				</div>

			</div>
		</div>
	);
}
