import {useDisplayScheduleItem} from "@/Stores/ScheduleItem";
import {calculateRowAssignments, getDayOffsetPercentage} from "@/Tools/ScheduleItem";
import ScheduleItemCard from "@/app/(Main)/EDT/ui/ScheduleItemCard";

interface ScheduleDisplayProps {
    jourIndex: number;
}

export default function ScheduleDisplay({jourIndex}: ScheduleDisplayProps) {
    const {displayScheduleItems} = useDisplayScheduleItem();
    const joursHoraires = displayScheduleItems.filter(
        (item) => item.startTime.getDay() === jourIndex
    );

    const rows = calculateRowAssignments(joursHoraires);

    return (
        <div className="flex flex-col w-full gap-2">
            {rows.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className="relative w-full h-[105px]">
                        {row.map((scheduleItem, index) => (
                            <ScheduleItemCard
                                key={index}
                                scheduleItem={scheduleItem}
                                left={getDayOffsetPercentage(scheduleItem.startTime)}
                            />
                        ))}
                    </div>
                );
            }
            )}
        </div>
    );
}

