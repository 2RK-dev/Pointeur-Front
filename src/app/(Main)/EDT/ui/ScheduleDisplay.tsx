import { useState } from "react";
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

    // Track heights of cards in each row: key is `${rowIndex}-${cardIndex}`
    const [cardHeights, setCardHeights] = useState<Record<string, number>>({});

    const handleHeightChange = (rowIndex: number, cardIndex: number, height: number) => {
        const key = `${rowIndex}-${cardIndex}`;
        setCardHeights((prev) => {
            if (prev[key] === height) return prev;
            return {
                ...prev,
                [key]: height,
            };
        });
    };

    const getRowHeight = (rowIndex: number) => {
        const heights = Object.entries(cardHeights)
            .filter(([key]) => key.startsWith(`${rowIndex}-`))
            .map(([_, val]) => val);
        return heights.length > 0 ? Math.max(...heights, 105) : 105;
    };

    return (
        <div className="flex flex-col w-full gap-2">
            {rows.map((row, rowIndex) => {
                const rowHeight = getRowHeight(rowIndex);
                return (
                    <div 
                        key={rowIndex} 
                        className="relative w-full transition-all duration-200 ease-in-out"
                        style={{ height: `${rowHeight}px` }}
                    >
                        {row.map((scheduleItem, cardIndex) => (
                            <ScheduleItemCard
                                key={cardIndex}
                                scheduleItem={scheduleItem}
                                left={getDayOffsetPercentage(scheduleItem.startTime)}
                                cardIndex={cardIndex}
                                onHeightChange={(cIdx, h) => handleHeightChange(rowIndex, cIdx, h)}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

