"use client";

import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
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
import {getAllNextWeeksFromDate} from "@/Tools/ScheduleItem";
import {Level} from "@/Types/Level";
import {getLevels} from "@/services/Level";
import {TranspositionResponse, Week, WeekSchema} from "@/Types/ScheduleItem";
import Transpose from "@/app/(Main)/EDT/ui/Transpose";
import {useLevelStore} from "@/Stores/Level";
import {useTeacherStore} from "@/Stores/Teacher";
import {getTeachers} from "@/services/Teacher";
import {useRoomsStore} from "@/Stores/Room";
import {getRoomsService} from "@/services/Room";
import {Teacher} from "@/Types/Teacher";
import {Room} from "@/Types/Room";
import {TranspositionResultBadges} from "@/app/(Main)/EDT/ui/transposition-result-badges";

const NUMBER_OF_WEEK_TO_DISPLAY = 5;
const TODAY = new Date();

export default function Schedule() {
    const {currentScheduleItems, setCurrentScheduleItems} = useCurrentScheduleItemsStore();
    const {
        displayMode,
        setDisplayMode,
        setScheduleItemsByLevel,
        setScheduleItemsByTeacher,
        setScheduleItemsByRoom
    } = useDisplayScheduleItem();
    const setSelectedScheduleItem = useSelectedScheduleItemStore((s) => s.setSelectedScheduleItem);
    const roomList = useRoomsStore((s) => s.rooms);
    const setRoomList = useRoomsStore((s) => s.setRooms);
    const [selectedWeek, setSelectedWeek] = useState<Week>();
    const teacherList = useTeacherStore((s) => s.teachers);
    const setTeacherList = useTeacherStore((s) => s.setTeachers);
    const levelList = useLevelStore((s) => s.levels);
    const setLevelList = useLevelStore((s) => s.setLevels);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const setOpenForm = useOpenScheduleItemFormStore((s) => s.setOpen);
    const [isTransposeModalOpen, setIsTransposeModalOpen] = useState(false);
    const [transpositionResponse, setTranspositionResponse] = useState<TranspositionResponse | null>();
    const [isClosingTranspositionBadges, setIsClosingTranspositionBadges] = useState<boolean>(false);

    useEffect(() => {
        if (!selectedWeek) return
        const {start, end} = selectedWeek;
        getScheduleItems(start, end).then((items) => {
            setCurrentScheduleItems(items);
        }).catch((error) => {
            console.error("Error fetching schedule items:", error);
        });

        if (!levelList) {
            getLevels().then((levels) => {
                setLevelList(levels);
                if (levels.length > 0) {
                    setSelectedLevel(levels[0]);
                }
            }).catch((error) => {
                console.error("Error fetching levels:", error);
            })
        } else if (levelList.length > 0) {
            setSelectedLevel(levelList[0]);
        }

        if (!teacherList) {
            getTeachers().then((teachers) => {
                setTeacherList(teachers);
                if (teachers.length > 0) {
                    setSelectedTeacherId(teachers[0].id);
                }
            }).catch((error) => {
                console.error("Error fetching teachers:", error);
            });
        } else if (teacherList.length > 0) {
            setSelectedTeacherId(teacherList[0].id);
        }

        if (!roomList) {
            getRoomsService().then((rooms) => {
                setRoomList(rooms);
                if (rooms.length > 0) {
                    setSelectedRoomId(rooms[0].id);
                }
            }).catch((error) => {
                console.error("Error fetching rooms:", error);
            })
        } else if (roomList.length > 0) {
            setSelectedRoomId(roomList[0].id);
        }

    }, []);


    useEffect(() => {
        if (!selectedWeek) return;
        const {start, end} = selectedWeek;
        const filtered = currentScheduleItems.filter(item => {
            return item.startTime >= start && item.endTime <= end;
        });
        if (displayMode === "Student" && selectedLevel) setScheduleItemsByLevel(selectedLevel.groups || [], filtered);
        else if (displayMode === "Teacher" && selectedTeacherId) setScheduleItemsByTeacher(selectedTeacherId, filtered);
        else if (displayMode === "Room" && selectedRoomId) setScheduleItemsByRoom(selectedRoomId, filtered);
    }, [selectedWeek, currentScheduleItems, displayMode, selectedLevel, selectedTeacherId, selectedRoomId]);

    useEffect(() => {
        if (transpositionResponse) {
            setIsClosingTranspositionBadges(false);
        } else {
            setIsClosingTranspositionBadges(true);
        }
    }, [transpositionResponse]);

    const onCloseTranspositionBadges = () => {
        setIsClosingTranspositionBadges(true);
        setTimeout(() => {
            setTranspositionResponse(null);
        }, 300);
    }

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
                <SelectComponent setSelectedTeacher={setSelectedTeacherId} setSelectedLevel={setSelectedLevel}
                                 setSelectedRoom={setSelectedRoomId}
                                 levelList={levelList} teacherList={teacherList} roomList={roomList}
                />
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
                    <ScheduleForm selectedLevel={selectedLevel} selectedTeacherId={selectedTeacherId}
                                  selectedRoomId={selectedRoomId}
                                  levelList={levelList || []} teacherList={teacherList || []} roomList={roomList || []}/>

                    <Transpose isTransposeModalOpen={isTransposeModalOpen}
                               setIsTransposeModalOpen={setIsTransposeModalOpen}
                               selectedWeek={selectedWeek}/>
                </>)}
            <TranspositionResultBadges
                successItems={transpositionResponse?.successItems || []}
                failedItems={transpositionResponse?.failedItems || []}
                isClosing={isClosingTranspositionBadges}
                onClose={onCloseTranspositionBadges}
            />
        </div>
    );
}

interface selectComponentProps {
    setSelectedLevel: (level: Level | null) => void;
    setSelectedTeacher: (teacherId: number | null) => void;
    setSelectedRoom: (roomId: number | null) => void;
    levelList: Level[] | null;
    teacherList: Teacher[] | null;
    roomList: Room[] | null;
}

function SelectComponent({
                             setSelectedLevel,
                             setSelectedTeacher,
                             setSelectedRoom,
                             levelList,
                             teacherList,
                             roomList
                         }: selectComponentProps) {
    const displayMode = useDisplayScheduleItem((s) => s.displayMode);
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
        if (displayMode === "Student" && levelList && levelList.length > 0) {
            setSelectedValue(levelList[0].id.toString());
            setSelectedLevel(levelList[0]);
            setSelectedTeacher(null);
            setSelectedRoom(null);
        } else if (displayMode === "Teacher" && teacherList && teacherList.length > 0) {
            setSelectedValue(teacherList[0].id.toString());
            setSelectedTeacher(teacherList[0].id);
            setSelectedLevel(null);
            setSelectedRoom(null);
        } else if (displayMode === "Room" && roomList && roomList.length > 0) {
            setSelectedValue(roomList[0].id.toString());
            setSelectedRoom(roomList[0].id);
            setSelectedLevel(null);
            setSelectedTeacher(null);
        } else {
            setSelectedValue("");
            setSelectedLevel(null);
            setSelectedTeacher(null);
            setSelectedRoom(null);
        }
    }, [displayMode, levelList, teacherList, roomList]);

    return (
        <Select value={selectedValue} onValueChange={(value) => {
            setSelectedTeacher(null);
            setSelectedLevel(null);
            setSelectedRoom(null);
            if (displayMode === "Student") {
                const level = levelList?.find(l => l.id.toString() === value);
                if (level) setSelectedLevel(level);
            } else if (displayMode === "Teacher") setSelectedTeacher(parseInt(value));
            else if (displayMode === "Room") setSelectedRoom(parseInt(value));
            setSelectedValue(value);
        }}>
            <SelectTrigger className="w-[250px] mb-4">
                <SelectValue placeholder={"Sélectionner un " + getDisplayLabel(displayMode)}/>
            </SelectTrigger>
            <SelectContent>
                {displayMode === "Student" && levelList ? levelList.map((level) => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                        {level.name}
                    </SelectItem>
                )) : displayMode === "Teacher" && teacherList ? teacherList.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.name}
                    </SelectItem>
                )) : displayMode === "Room" && roomList ? roomList.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                        {room.name}
                    </SelectItem>
                )) : <div className=" p-2 text-sm text-muted-foreground">Aucun élément disponible</div>}
            </SelectContent>
        </Select>

    )
}
