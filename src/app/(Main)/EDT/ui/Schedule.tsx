"use client";

import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {CirclePlus, Copy, FileText} from "lucide-react";
import {useEffect, useState} from "react";
import EdtEncapsuler from "./EdtEncapsuler";
import ScheduleForm from "@/app/(Main)/EDT/ui/schedule-form";
import {
    useCurrentScheduleItemsStore,
    useOpenScheduleItemFormStore,
    useScheduleItemByLevelStore,
    useSelectedScheduleItemStore
} from "@/Stores/ScheduleItem";
import {getScheduleItems} from "@/services/ScheduleItem";
import {generatePDF} from "@/Tools/PDF";
import {getAllNextWeeksFromDate} from "@/Tools/ScheduleItem";
import {useSelectedLevelStore} from "@/Stores/Level";
import {Level} from "@/Types/Level";
import {getLevels} from "@/services/Level";
import {Week, WeekSchema} from "@/Types/ScheduleItem";
import Transpose from "@/app/(Main)/EDT/ui/Transpose";

const NUMBER_OF_WEEK_TO_DISPLAY = 5;
const TODAY = new Date();

export default function Schedule() {
    const {currentScheduleItems, setCurrentScheduleItems} = useCurrentScheduleItemsStore();
    const {setScheduleItemsByLevel} = useScheduleItemByLevelStore();
    const setSelectedScheduleItem = useSelectedScheduleItemStore((s) => s.setSelectedScheduleItem);
    const [selectedWeek, setSelectedWeek] = useState<Week>();
    const [levels, setLevels] = useState<Level[]>([]);
    const {selectedLevel, setSelectedLevel} = useSelectedLevelStore();
    const setOpenForm = useOpenScheduleItemFormStore((s) => s.setOpen);
    const [isTransposeModalOpen, setIsTransposeModalOpen] = useState(false);

    useEffect(() => {
        if (!selectedWeek) return
        const {start, end} = selectedWeek;
        getScheduleItems(start, end).then((items) => {
            setCurrentScheduleItems(items);
        }).catch((error) => {
            console.error("Error fetching schedule items:", error);
        });

        getLevels().then((levels) => {
            setLevels(levels);
            if (levels.length > 0) {
                setSelectedLevel(levels[0]);
            }
        }).catch((error) => {
            console.error("Error fetching levels:", error);
        })
    }, []);


    useEffect(() => {
        if (!selectedWeek) return;
        const {start, end} = selectedWeek;
        const filtered = currentScheduleItems.filter(item => {
            return item.startTime >= start && item.endTime <= end;
        });
        if (!selectedLevel) return;
        setScheduleItemsByLevel(selectedLevel?.groups || [], filtered);
    }, [selectedWeek, selectedLevel, currentScheduleItems]);

    const TransposeData = (TargetWeek: number) => {
        alert(`Transposing data to week ${TargetWeek}`);
    };


    return (
        <div className="p-4  min-w-[1250px]">
            <div className="mb-4 flex justify-between items-center">
                <Select
                    value={JSON.stringify(selectedWeek)}
                    onValueChange={(value) => {
                        setSelectedWeek(WeekSchema.parse(JSON.parse(value)));
                    }}>
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Sélectionner la semaine"/>
                    </SelectTrigger>
                    <SelectContent>
                        {getAllNextWeeksFromDate(NUMBER_OF_WEEK_TO_DISPLAY, TODAY).map((week, index) => (
                            <SelectItem key={index} value={JSON.stringify(week)}>
                                {
                                    `${week.start.toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })} - ${week.end.toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedLevel?.id.toString()} onValueChange={(val) => {
                    const level = levels.find((l) => l.id.toString() === val);
                    if (level) {
                        setSelectedLevel(level);
                    }
                }}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Sélectionner le niveau"/>
                    </SelectTrigger>
                    <SelectContent>
                        {levels.length === 0 ? (
                            <SelectItem value="-1" disabled={true}>Aucun niveau disponible</SelectItem>
                        ) : levels.map((level) => (
                            <SelectItem key={level.id} value={level.id.toString()}>
                                {level.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className=" space-x-4">
                    <Button disabled={!selectedWeek}
                            onClick={() => {
                            setIsTransposeModalOpen(true);
                        }}>
                        <Copy/>
                    </Button>
                    <Button disabled={!selectedWeek}  onClick={generatePDF}>
                        <FileText/>
                    </Button>
                    <Button disabled={!selectedWeek}
                        onClick={() => {
                        setSelectedScheduleItem(null);
                        setOpenForm(true)
                    }}>
                        <CirclePlus/>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col space-y-4" id="edt-content">
                <EdtEncapsuler/>
            </div>
            {selectedWeek && (
                <>
                    <ScheduleForm/>
                    <Transpose isTransposeModalOpen={isTransposeModalOpen}
                               setIsTransposeModalOpen={setIsTransposeModalOpen}
                               selectedWeek={selectedWeek}/>
                </>)}
        </div>
    );
}
