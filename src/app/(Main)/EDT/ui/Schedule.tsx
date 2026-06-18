"use client";

import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {CirclePlus, Copy, FileText} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import EdtEncapsuler from "./EdtEncapsuler";
import ScheduleForm from "@/app/(Main)/EDT/ui/schedule-form";
import {
    useCurrentScheduleItemsStore,
    useCopiedScheduleItemStore,
    useDisplayScheduleItem,
    useOpenScheduleItemFormStore,
    useSelectedScheduleItemStore
} from "@/Stores/ScheduleItem";
import {getScheduleItems} from "@/services/ScheduleItem";
import {formatWeek, getAllNextWeeksFromDate} from "@/Tools/ScheduleItem";
import {LevelDetailsDTO} from "@/Types/LevelDTO";
import {getLevelListService} from "@/services/Level";
import {TranspositionResponse, Week, WeekSchema} from "@/Types/ScheduleItem";
import Transpose from "@/app/(Main)/EDT/ui/Transpose";
import {useLevelStore} from "@/Stores/Level";
import {useTeacherStore} from "@/Stores/Teacher";
import {getTeachers} from "@/services/Teacher";
import {useRoomsStore} from "@/Stores/Room";
import {getRoomsService} from "@/services/Room";
import {Teacher} from "@/Types/Teacher";
import {Room} from "@/Types/Room";
import {ImportResultShow} from "@/app/(Main)/EDT/ui/import-result-show";
import {notifications} from "@/components/notifications";
import {PrintTemplate} from "@/hooks/useReactToPrint";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const NUMBER_OF_WEEK_TO_DISPLAY = 7;
const WEEKS_AGO = 2;
const TODAY = new Date();
TODAY.setDate(TODAY.getDate() - (WEEKS_AGO * 7));

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
    const setCopiedScheduleItem = useCopiedScheduleItemStore((s) => s.setCopiedScheduleItem);
    const roomList = useRoomsStore((s) => s.rooms);
    const setRoomList = useRoomsStore((s) => s.setRooms);
    const [selectedWeek, setSelectedWeek] = useState<Week>();
    const teacherList = useTeacherStore((s) => s.teachers);
    const setTeacherList = useTeacherStore((s) => s.setTeachers);
    const levelList = useLevelStore((s) => s.levelsDetails);
    const setLevelList = useLevelStore((s) => s.setLevels);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<LevelDetailsDTO | null>(null)
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const setOpenForm = useOpenScheduleItemFormStore((s) => s.setOpen);
    const [isTransposeModalOpen, setIsTransposeModalOpen] = useState(false);
    const [transpositionResponse, setTranspositionResponse] = useState<TranspositionResponse | null>();
    const [isClosingTranspositionBadges, setIsClosingTranspositionBadges] = useState<boolean>(false);

    const allWeeks = useMemo(() => getAllNextWeeksFromDate(NUMBER_OF_WEEK_TO_DISPLAY, TODAY), []);

    useEffect(() => {
        if (!selectedWeek && allWeeks.length > 0) {
            const now = new Date();
            const currentWeekIndex = allWeeks.findIndex(
                (week) => now >= week.start && now <= week.end
            );
            setSelectedWeek(currentWeekIndex !== -1 ? allWeeks[currentWeekIndex] : allWeeks[2] || allWeeks[0]);
        }
    }, [allWeeks, selectedWeek]);

    useEffect(() => {
        const firstWeek = allWeeks[0];
        const lastWeek = allWeeks[allWeeks.length - 1];
        const promiseScheduleItem = getScheduleItems(firstWeek.start,lastWeek.end).then((items) => {
            setCurrentScheduleItems(items);
        })
        notifications.promise(promiseScheduleItem, {
            loading: "Chargement des éléments du planning...",
            success: "Éléments du planning chargés avec succès !",
            error: "Échec du chargement des éléments du planning."
        })


        if (!levelList) {
            const promiseLevel = getLevelListService().then((levels) => {
                setLevelList(levels);
                if (levels.length > 0) {
                    setSelectedLevel(levels[0]);
                }
            })
            notifications.promise(promiseLevel, {
                loading: "Chargement des niveaux...",
                success: "Niveaux chargés avec succès !",
                error: "Échec du chargement des niveaux."
            })
        } else if (levelList.length > 0 && !selectedLevel) {
            setSelectedLevel(levelList[0]);
        }

        if (!teacherList) {
            const promiseTeacher = getTeachers().then((teachers) => {
                setTeacherList(teachers);
                if (teachers.length > 0) {
                    setSelectedTeacherId(teachers[0].id);
                }
            })
            notifications.promise(promiseTeacher, {
                loading: "Chargement des enseignants...",
                success: "Enseignants chargés avec succès !",
                error: "Échec du chargement des enseignants."
            })
        } else if (teacherList.length > 0) {
            setSelectedTeacherId(teacherList[0].id);
        }

        if (!roomList) {
            const promiseRoom = getRoomsService().then((rooms) => {
                setRoomList(rooms);
                if (rooms.length > 0) {
                    setSelectedRoomId(rooms[0].id);
                }
            })
            notifications.promise(promiseRoom, {
                loading: "Chargement des salles...",
                success: "Salles chargées avec succès !",
                error: "Échec du chargement des salles."
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

    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: "Emploi_du_temps_" + (selectedLevel?.level.abr || "") + "_" + (selectedWeek ? formatWeek(selectedWeek) : ""),
    });

    const handleExportPDF = () => {
        if (!selectedWeek) return;

               const promise = new Promise<void>((resolve, reject) => {
            try {
                handlePrint();
                resolve();
            } catch (error) {
                reject(error);
            }
        });

        notifications.promise(promise, {
            loading: "Préparation de la mise en page...",
            success: "Fenêtre d'impression ouverte !",
            error: "Erreur lors de l'ouverture de l'impression."
        });
    };


    return (
        <div className="p-4 w-full max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Emploi du Temps
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gérez et visualisez vos plannings de cours par étudiant, enseignant ou salle.
                    </p>
                </div>
            </div>

            <div className="bg-card/40 backdrop-blur-md border border-muted/50 rounded-xl p-4 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex rounded-lg border bg-muted/50 p-1 self-start">
                        <button
                            type="button"
                            onClick={() => setDisplayMode("Student")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                displayMode === "Student"
                                    ? "bg-background shadow text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Vue Étudiant
                        </button>
                        <button
                            type="button"
                            onClick={() => setDisplayMode("Teacher")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                displayMode === "Teacher"
                                    ? "bg-background shadow text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Vue Enseignant
                        </button>
                        <button
                            type="button"
                            onClick={() => setDisplayMode("Room")}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                displayMode === "Room"
                                    ? "bg-background shadow text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Vue Salle
                        </button>
                    </div>

                    <div className="flex items-center">
                        <SelectComponent setSelectedTeacher={setSelectedTeacherId} setSelectedLevel={setSelectedLevel}
                                         setSelectedRoom={setSelectedRoomId}
                                         levelDetailList={levelList} teacherList={teacherList} roomList={roomList}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 xl:ml-auto">
                    <Select
                        value={selectedWeek ? JSON.stringify(selectedWeek) : undefined}
                        onValueChange={(value) => {
                            setSelectedWeek(WeekSchema.parse(JSON.parse(value)));
                        }}>
                        <SelectTrigger className="w-full sm:w-[260px] bg-background/50">
                            <SelectValue placeholder="Sélectionner la semaine"/>
                        </SelectTrigger>
                        <SelectContent>
                            {allWeeks.map((week, index) => (
                                <SelectItem key={index} value={JSON.stringify(week)}>
                                    {formatWeek(week)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                        <Button disabled={!selectedWeek}
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-initial gap-1.5 bg-background/50"
                                onClick={() => {
                                    setIsTransposeModalOpen(true);
                                }}
                                title="Transposer le planning vers une autre semaine">
                            <Copy className="h-4 w-4"/>
                            <span className="hidden sm:inline">Transposer</span>
                        </Button>
                        <Button disabled={!selectedWeek}
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-initial gap-1.5 bg-background/50"
                                onClick={handleExportPDF}
                                title="Exporter l'emploi du temps en PDF">
                            <FileText className="h-4 w-4"/>
                            <span className="hidden sm:inline">Exporter PDF</span>
                        </Button>
                        <Button disabled={!selectedWeek}
                                size="sm"
                                className="flex-1 sm:flex-initial gap-1.5 bg-primary shadow-sm hover:bg-primary/95"
                                onClick={() => {
                                    setCopiedScheduleItem(null);
                                    setSelectedScheduleItem(null);
                                    setOpenForm(true)
                                }}
                                title="Ajouter un nouveau cours au planning">
                            <CirclePlus className="h-4 w-4"/>
                            <span className="hidden sm:inline">Nouveau cours</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div ref={contentRef}>
                <PrintTemplate
                    options={{
                        title: "Emploi du Temps",
                        subtitle: displayMode === "Student"
                            ? (selectedLevel ? `Niveau : ${selectedLevel.level.name}` : "")
                            : displayMode === "Teacher"
                                ? (teacherList?.find(t => t.id === selectedTeacherId) ? `Enseignant : ${teacherList.find(t => t.id === selectedTeacherId)?.name}` : "")
                                : (roomList?.find(r => r.id === selectedRoomId) ? `Salle : ${roomList.find(r => r.id === selectedRoomId)?.name}` : ""),
                        week: selectedWeek ? formatWeek(selectedWeek) : ""
                    }}
                >
                    <div className="flex flex-col space-y-4">
                        <EdtEncapsuler/>
                    </div>
                </PrintTemplate>
            </div>
            {selectedWeek && (
                <>
                    <ScheduleForm selectedLevelDetails={selectedLevel} selectedTeacherId={selectedTeacherId}
                                  selectedRoomId={selectedRoomId}
                                  levelDetailsList={levelList || []} teacherList={teacherList || []}
                                  roomList={roomList || []}/>

                    <Transpose isTransposeModalOpen={isTransposeModalOpen}
                               setIsTransposeModalOpen={setIsTransposeModalOpen}
                               selectedWeek={selectedWeek}
                               setTransposeResponse={setTranspositionResponse}
                    />
                </>)}
            <ImportResultShow
                successItems={transpositionResponse?.successItems || []}
                failedItems={transpositionResponse?.failedItems || []}
                isClosing={isClosingTranspositionBadges}
                onClose={onCloseTranspositionBadges}
            />
        </div>
    );
}

interface selectComponentProps {
    setSelectedLevel: (level: LevelDetailsDTO | null) => void;
    setSelectedTeacher: (teacherId: number | null) => void;
    setSelectedRoom: (roomId: number | null) => void;
    levelDetailList: LevelDetailsDTO[] | null;
    teacherList: Teacher[] | null;
    roomList: Room[] | null;
}

function SelectComponent({
                             setSelectedLevel,
                             setSelectedTeacher,
                             setSelectedRoom,
                             levelDetailList,
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
        if (displayMode === "Student" && levelDetailList && levelDetailList.length > 0) {
            setSelectedValue(levelDetailList[0].level.id.toString());
            setSelectedLevel(levelDetailList[0]);
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
    }, [displayMode, levelDetailList, teacherList, roomList]);

    return (
        <Select value={selectedValue} onValueChange={(value) => {
            setSelectedTeacher(null);
            setSelectedLevel(null);
            setSelectedRoom(null);
            if (displayMode === "Student") {
                const level = levelDetailList?.find(l => l.level.id.toString() === value);
                if (level) setSelectedLevel(level);
            } else if (displayMode === "Teacher") setSelectedTeacher(parseInt(value));
            else if (displayMode === "Room") setSelectedRoom(parseInt(value));
            setSelectedValue(value);
        }}>
            <SelectTrigger className="w-[250px] bg-background/50">
                <SelectValue placeholder={"Sélectionner un " + getDisplayLabel(displayMode)}/>
            </SelectTrigger>
            <SelectContent>
                {displayMode === "Student" && levelDetailList ? levelDetailList.map((levelDetail) => (
                    <SelectItem key={levelDetail.level.id} value={levelDetail.level.id.toString()}>
                        {levelDetail.level.name}
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
