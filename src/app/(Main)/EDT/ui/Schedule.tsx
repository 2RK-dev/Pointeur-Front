"use client";

import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {CirclePlus, Copy, FileText} from "lucide-react";
import {useEffect, useState} from "react";
import EdtEncapsuler from "./EdtEncapsuler";
import ScheduleForm from "@/app/(Main)/EDT/ui/schedule-form";
import {
    useCurrentScheduleItemsStore,
    useDisplayScheduleItem,
    useOpenScheduleItemFormStore,
    useSelectedScheduleItemStore
} from "@/Stores/ScheduleItem";
import {getScheduleItems} from "@/services/ScheduleItem";
import {generatePDF} from "@/Tools/PDF";
import {getNextFourWeeks, getWeekRange} from "@/Tools/ScheduleItem";
import {Level} from "@/Types/Level";
import {getLevels} from "@/services/Level";
import {useLevelStore} from "@/Stores/Level";
import {useTeacherStore} from "@/Stores/Teacher";
import {getTeachers} from "@/services/Teacher";

export default function Schedule() {
    const {currentScheduleItems, setCurrentScheduleItems} = useCurrentScheduleItemsStore();
    const setScheduleItemsByLevel = useDisplayScheduleItem((s) => s.setScheduleItemsByLevel);
    const setScheduleItemsByTeacher = useDisplayScheduleItem((s) => s.setScheduleItemsByTeacher);
    const setSelectedScheduleItem = useSelectedScheduleItemStore((s) => s.setSelectedScheduleItem);
    const displayMode = useDisplayScheduleItem((s) => s.displayMode);
    const setDisplayMode = useDisplayScheduleItem((s) => s.setDisplayMode);
    const [selectedWeek, setSelectedWeek] = useState<number>(0);
    const [TargetWeek, setTargetWeek] = useState<number>(0);
    const teachers = useTeacherStore((s) => s.teachers);
    const setTeachers = useTeacherStore((s) => s.setTeachers);
    const levels = useLevelStore((s) => s.levels);
    const setLevels = useLevelStore((s) => s.setLevels);
    const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
    const setOpenForm = useOpenScheduleItemFormStore((s) => s.setOpen);
    const [isTransposeModalOpen, setIsTransposeModalOpen] = useState(false);

    useEffect(() => {
        const {start} = getWeekRange(0);
        const {end} = getWeekRange(3);
        getScheduleItems(start, end).then((items) => {
            setCurrentScheduleItems(items);
        }).catch((error) => {
            console.error("Error fetching schedule items:", error);
        });

        if (!levels) {
            getLevels().then((levels) => {
                setLevels(levels);
                if (levels.length > 0) {
                    setSelectedLevel(levels[0]);
                }
            }).catch((error) => {
                console.error("Error fetching levels:", error);
            })
        } else if (levels.length > 0) {
            setSelectedLevel(levels[0]);
        }

        if (!teachers) {
            getTeachers().then((teachers) => {
                setTeachers(teachers);
                if (teachers.length > 0) {
                    setSelectedTeacher(teachers[0].id);
                }
            }).catch((error) => {
                console.error("Error fetching teachers:", error);
            });
        } else if (teachers.length > 0) {
            setSelectedTeacher(teachers[0].id);
        }

    }, []);


    useEffect(() => {
        const {start, end} = getWeekRange(selectedWeek);
        const filtered = currentScheduleItems.filter(item => {
            return item.startTime >= start && item.endTime <= end;
        });
        if (displayMode === "Student" && selectedLevel) {
            setScheduleItemsByLevel(selectedLevel?.groups || [], filtered);
        } else if (displayMode === "Teacher" && selectedTeacher) {
            setScheduleItemsByTeacher(selectedTeacher, filtered);
        }
    }, [selectedWeek, selectedLevel, currentScheduleItems, displayMode, selectedTeacher]);

    const TransposeData = (TargetWeek: number) => {
        alert(`Transposing data to week ${TargetWeek}`);
    };


    return (
        <div className="p-4  min-w-[1250px]">
            <div>
                <Select value={displayMode} onValueChange={(val) => {
                    setDisplayMode(val as "Student" | "Teacher" | "Room");
                }}>
                    <SelectTrigger className="w-[180px] mb-4">
                        <SelectValue placeholder="Sélectionner la vue"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Student">Vue Étudiant</SelectItem>
                        <SelectItem value="Teacher">Vue Enseignant</SelectItem>
                        <SelectItem value="Room">Vue Salle</SelectItem>
                    </SelectContent>
                </Select>
            </div>
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
                <SelectComponent setSelectedTeacher={setSelectedTeacher} setSelectedLevel={setSelectedLevel}/>
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
                    <Button onClick={() => {
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

            <ScheduleForm selectedLevel={selectedLevel} selectedTeacherId={selectedTeacher} levelList={levels || [] }/>

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

interface selectComponentProps {
    setSelectedLevel: (level: Level | null) => void;
    setSelectedTeacher: (teacherId: number | null) => void;
}

function SelectComponent({setSelectedLevel, setSelectedTeacher}: selectComponentProps) {
    const displayMode = useDisplayScheduleItem((s) => s.displayMode);
    const levels = useLevelStore((s) => s.levels);
    const teachers = useTeacherStore((s) => s.teachers);
    const [selectedValue, setSelectedValue] = useState<string>("");
    const getDisplayLabel = (mode: string) => {
        switch (mode) {
            case "Student":
                return "niveau";
            case "Teacher":
                return "enseignant";
            case "Room":
                return "salle";
            default:
                return "";
        }
    }

    useEffect(() => {
        if(displayMode === "Student" && levels && levels.length > 0){
            setSelectedValue(levels[0].id.toString());
            setSelectedLevel(levels[0]);
            setSelectedTeacher(null);
        } else if(displayMode === "Teacher" && teachers && teachers.length > 0){
            setSelectedValue(teachers[0].id.toString());
            setSelectedTeacher(teachers[0].id);
            setSelectedLevel(null);
        } else {
            setSelectedValue("");
            setSelectedLevel(null);
            setSelectedTeacher(null);
        }
    }, [displayMode, levels, teachers]);

    return (
        <Select value={selectedValue} onValueChange={(value) => {
            setSelectedTeacher(null);
            setSelectedLevel(null);
            if (displayMode === "Student") {
                const level = levels?.find(l => l.id.toString() === value);
                if (level) {
                    setSelectedLevel(level);
                }
            } else if (displayMode === "Teacher") {
                const teacherId = parseInt(value);
                setSelectedTeacher(teacherId);
            }
            setSelectedValue(value);
        }}
        >
            <SelectTrigger className="w-[250px] mb-4">
                <SelectValue placeholder={"Sélectionner un " + getDisplayLabel(displayMode)}/>
            </SelectTrigger>
            <SelectContent>
                {displayMode === "Student" && levels ? levels.map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                        {level.name}
                    </SelectItem>
                )) : displayMode === "Teacher" && teachers ? teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.name}
                    </SelectItem>
                )) :<div className=" p-2 text-sm text-muted-foreground">Aucun élément disponible</div>}
            </SelectContent>
        </Select>

    )
}
