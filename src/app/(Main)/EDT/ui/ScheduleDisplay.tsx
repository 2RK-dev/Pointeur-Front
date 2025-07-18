import {useScheduleItemByLevelStore} from "@/app/Stores/ScheduleItem";
import {calculateRowAssignments, getWidthPercentageFor} from "@/Tools/ScheduleItem";
import ScheduleItemCard from "@/app/(Main)/EDT/ui/ScheduleItemCard";

interface ScheduleDisplayProps {
    jourIndex: number;
}

export default function ScheduleDisplay({jourIndex}: ScheduleDisplayProps) {
    const {scheduleItemsByLevel} = useScheduleItemByLevelStore();
    const joursHoraires = scheduleItemsByLevel.filter(
        (item) => item.startTime.getDay() === jourIndex
    );


    const rows = calculateRowAssignments(joursHoraires);

    let lastEnd : Date = new Date();

    return (
        <div className="flex flex-col w-full gap-2">
            {rows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="relative w-full flex gap-1 min-h-[60px]"
                >

                    {row.map((scheduleItem, index) => {
                        let gapMin;
                        if(index != 0) gapMin = (scheduleItem.startTime.getTime() - lastEnd.getTime()) / 60000;
                        else {
                            gapMin = (scheduleItem.startTime.getTime() - new Date(scheduleItem.startTime).setHours(7, 0, 0, 0)) / 60000;
                        }
                        lastEnd = scheduleItem.endTime;
                        return (
                            <ScheduleItemCard
                                key={index}
                                scheduleItem={scheduleItem}
                                left={getWidthPercentageFor(gapMin)}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

