"use client";

import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {CirclePlus, Copy, FileText} from "lucide-react";
import {useEffect, useState} from "react";
import EdtEncapsuler from "./EdtEncapsuler";
import ScheduleForm from "@/app/(Main)/EDT/ui/schedule-form";
import {useCurrentScheduleItemsStore, useScheduleItemByLevelStore} from "@/app/Stores/ScheduleItem";
import {getScheduleItems} from "@/services/ScheduleItem";
import {generatePDF} from "@/Tools/PDF";
import {getNextFourWeeks, getWeekRange} from "@/Tools/ScheduleItem";
import {useCurrentLevelStore} from "@/app/Stores/Level";
import {Level} from "@/Types/Level";
import {getLevels} from "@/services/Level";

export default function Schedule() {
    const {currentScheduleItems, setCurrentScheduleItems} = useCurrentScheduleItemsStore();
    const {setScheduleItemsByLevel} = useScheduleItemByLevelStore();
    const [selectedWeek, setSelectedWeek] = useState<number>(0);
    const [TargetWeek, setTargetWeek] = useState<number>(0);
    const [levels, setSelectedNiveau] = useState<Level[]>([]);
    const {currentLevel, setCurrentLevel} = useCurrentLevelStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isTransposeModalOpen, setIsTransposeModalOpen] = useState(false);

    useEffect(() => {
        const {start} = getWeekRange(0);
        const {end} = getWeekRange(3);
        getScheduleItems(start, end).then((items) => {
            setCurrentScheduleItems(items);
        }).catch((error) => {
            console.error("Error fetching schedule items:", error);
        });

        getLevels().then((levels) => {
            setSelectedNiveau(levels);
            if (levels.length > 0) {
                setCurrentLevel(levels[0]);
            }
        }).catch((error) => {
            console.error("Error fetching levels:", error);
        })
    }, []);


    useEffect(() => {
        const {start, end} = getWeekRange(selectedWeek);
        const filtered = currentScheduleItems.filter(item => {
            return item.startTime >= start && item.endTime <= end;
        });
        if (!currentLevel) return;
        setScheduleItemsByLevel(currentLevel?.groups || [], filtered);
    }, [selectedWeek, currentLevel]);

    const TransposeData = (TargetWeek: number) => {
        alert(`Transposing data to week ${TargetWeek}`);
    };


    return (
        <div className="p-4  min-w-[1250px]">
            <div className="mb-4 flex justify-between items-center">
                <Select
                    value={selectedWeek.toString()}
                    onValueChange={(value) => {
                        setSelectedWeek(parseInt(value));
                    }}>
                    <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Sélectionner la semaine"/>
                    </SelectTrigger>
                    <SelectContent>
                        {getNextFourWeeks().map((week, index) => (
                            <SelectItem key={index} value={index.toString()}>
                                {`(${week.start.toLocaleDateString()} - ${week.end.toLocaleDateString()})`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={currentLevel?.id.toString() || "0"} onValueChange={(val) => {
                    const level = levels.find((l) => l.id.toString() === val);
                    if (level) {
                        setCurrentLevel(level);
                    }
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner le niveau"/>
                    </SelectTrigger>
                    <SelectContent>
                        {levels.map((level) => (
                            <SelectItem key={level.id} value={level.id.toString()}>
                                {level.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className=" space-x-4">
                    <Button
                        onClick={() => {
                            setIsTransposeModalOpen(true);
                        }}>
                        <Copy/>
                    </Button>
                    <Button onClick={generatePDF}>
                        <FileText/>
                    </Button>
                    <Button onClick={() => setIsFormOpen(true)}>
                        <CirclePlus/>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col space-y-4" id="edt-content">
                <EdtEncapsuler/>
            </div>

            <ScheduleForm isFormOpen={isFormOpen} setIsFormOpenAction={setIsFormOpen}/>

            <Dialog
                open={isTransposeModalOpen}
                onOpenChange={setIsTransposeModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transposer les données</DialogTitle>
                    </DialogHeader>
                    <Select
                        onValueChange={(value) => {
                            setTargetWeek(parseInt(value));
                        }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la semaine cible"/>
                        </SelectTrigger>
                        <SelectContent>
                            {getNextFourWeeks().map((week, index) => (
                                <SelectItem key={index} value={index.toString()}>
                                    {`(${week.start.toLocaleDateString()} - ${week.end.toLocaleDateString()})`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button
                            onClick={() => {
                                TransposeData(TargetWeek);
                                setIsTransposeModalOpen(false);
                            }}>
                            Transposer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
