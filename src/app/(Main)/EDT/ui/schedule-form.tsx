"use client"

import {useEffect, useMemo, useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {BookOpen, CalendarIcon, Users} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"
import {getTeachingUnits} from "@/services/TeachingUnit"
import type {Teacher} from "@/Types/Teacher"
import type {Room} from "@/Types/Room"
import {generateHours} from "@/Tools/ScheduleItem"
import {
    useCurrentScheduleItemsStore,
    useOpenScheduleItemFormStore,
    useSelectedScheduleItemStore,
} from "@/Stores/ScheduleItem"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {addScheduleItemService, deleteScheduleItemService, updateScheduleItemService} from "@/services/ScheduleItem"
import {ScheduleItemPostSchema} from "@/Types/ScheduleItem"
import {useTeachingUnitStore} from "@/Stores/TeachingUnit"
import {ScrollArea} from "@/components/ui/scroll-area";
import {LevelDetailsDTO} from "@/Types/LevelDTO";

const hours = generateHours()

const ScheduleItemFormSchema = z.object({
    date: z.date({
        required_error: "Veuillez sélectionner une date",
    }),
    startTime: z.string().min(1, "Veuillez sélectionner l'heure de début"),
    endTime: z.string().min(1, "Veuillez sélectionner l'heure de fin"),
    teachingUnitID: z.number({
        required_error: "Veuillez sélectionner une unité de cours",
    }).nullable(),
    teacherId: z.number({
        required_error: "Veuillez sélectionner un enseignant",
    }).nullable(),
    roomId: z.number({
        required_error: "Veuillez sélectionner une salle",
    }),
    groupIds: z.array(z.string()).min(1, "Veuillez sélectionner au moins un groupe"),
})

interface props {
    selectedLevelDetails: LevelDetailsDTO | null,
    selectedTeacherId: number | null,
    selectedRoomId: number | null,
    levelDetailsList: LevelDetailsDTO[],
    teacherList: Teacher[],
    roomList: Room[],
}

export default function ScheduleForm({selectedLevelDetails,selectedTeacherId,selectedRoomId, levelDetailsList,teacherList,roomList}: props) {
    const {open, setOpen} = useOpenScheduleItemFormStore()
    const [calendarOpen, setCalendarOpen] = useState(false)
    const teachingUnits = useTeachingUnitStore((s) => s.teachingUnits)
    const setTeachingUnits = useTeachingUnitStore((s) => s.setTeachingUnits)
    const getTeachingUnitByLevel = useTeachingUnitStore((s) => s.getTeachingUnitByLevel)
    const getAvailableGroups = useCurrentScheduleItemsStore((s) => s.getAvailableGroups)
    const getAvailableTeachers = useCurrentScheduleItemsStore((s) => s.getAvailableTeachers)
    const getAvailableRooms = useCurrentScheduleItemsStore((s) => s.getAvailableRooms)
    const currentScheduleItems = useCurrentScheduleItemsStore((s) => s.currentScheduleItems)
    const addScheduleItem = useCurrentScheduleItemsStore((s) => s.addScheduleItem)
    const updateScheduleItem = useCurrentScheduleItemsStore((s) => s.updateScheduleItem)
    const removeScheduleItem = useCurrentScheduleItemsStore((s) => s.removeScheduleItem)
    const selectedScheduleItem = useSelectedScheduleItemStore((s) => s.selectedScheduleItem)
    const [selectedLevelDetailState, setselectedLevelDetailState] = useState<LevelDetailsDTO | null>(selectedLevelDetails)

    const defaultValues = {
        date: selectedScheduleItem?.startTime || undefined,
        startTime:
            selectedScheduleItem?.startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }) || undefined,
        endTime:
            selectedScheduleItem?.endTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }) || undefined,
        teachingUnitID: selectedScheduleItem?.TeachingUnit.id || undefined,
        teacherId: selectedScheduleItem?.Teacher.id || selectedTeacherId || undefined,
        roomId: selectedScheduleItem?.Room?.id || selectedRoomId || undefined,
        groupIds: selectedScheduleItem?.Groups.map((grp) => grp.id.toString()) || [],
    }

    const form = useForm<z.infer<typeof ScheduleItemFormSchema>>({
        resolver: zodResolver(ScheduleItemFormSchema),
        defaultValues: defaultValues,
    })

    useEffect(() => {
        form.reset(defaultValues)
        if (selectedScheduleItem) {
            const level = levelDetailsList.find(l => l.level.id === selectedScheduleItem.Groups[0]?.levelId) || null
            setselectedLevelDetailState(level)
        } else {
            setselectedLevelDetailState(selectedLevelDetails)
        }
    }, [selectedLevelDetails, selectedTeacherId,selectedRoomId, selectedScheduleItem])


    const watchedDate = form.watch("date")
    const watchedStartTime = form.watch("startTime")
    const watchedEndTime = form.watch("endTime")
    const watchedGroupIds = form.watch("groupIds")

    useEffect(() => {
        if (!teachingUnits) {
            getTeachingUnits()
                .then((unitsData) => {
                    setTeachingUnits(unitsData)
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des unités de cours :", error)
                })
        }
    }, [])

    useEffect(() => {
        if (watchedStartTime && watchedEndTime) {
            const [startHour, startMinute] = watchedStartTime.split(":").map(Number)
            const [endHour, endMinute] = watchedEndTime.split(":").map(Number)

            const startTotalMinutes = startHour * 60 + startMinute
            const endTotalMinutes = endHour * 60 + endMinute

            if (startTotalMinutes >= endTotalMinutes) {
                form.setError("endTime", {message: "L'heure de fin doit être après l'heure de début"})
            } else {
                form.clearErrors("endTime")
            }
        } else {
            form.clearErrors("endTime")
        }
    }, [watchedStartTime, watchedEndTime, form])

    const startDateTime = new Date(watchedDate)
    if (watchedStartTime) {
        const [startHour, startMinute] = watchedStartTime.split(":").map(Number)
        startDateTime.setHours(startHour, startMinute, 0, 0)
    }

    const endDateTime = new Date(watchedDate)
    if (watchedEndTime) {
        const [endHour, endMinute] = watchedEndTime.split(":").map(Number)
        endDateTime.setHours(endHour, endMinute, 0, 0)
    }

    const teachingUnitByLevel = useMemo(() => {
        return getTeachingUnitByLevel(selectedLevelDetailState?.level.id || null)
    }, [selectedLevelDetailState, teachingUnits])

    const availableGroups = useMemo(() => {
        if (!selectedLevelDetailState || !watchedDate || !watchedStartTime || !watchedEndTime) {
            return []
        }
        return getAvailableGroups(
            startDateTime,
            endDateTime,
            selectedLevelDetailState.groups,
            selectedScheduleItem,
        )
    }, [currentScheduleItems, selectedLevelDetailState, watchedDate, watchedStartTime, watchedEndTime])

    const availableTeachers = useMemo(() => {
            if (!selectedLevelDetailState || !watchedDate || !watchedStartTime || !watchedEndTime) {
                return []
            }
            return getAvailableTeachers(
                startDateTime,
                endDateTime,
                teacherList,
                selectedScheduleItem,
            )
        }
        , [currentScheduleItems, selectedLevelDetailState, watchedDate, watchedStartTime, watchedEndTime, teacherList])

    const availableRooms = useMemo(() => {
        if (!selectedLevelDetailState || !watchedDate || !watchedStartTime || !watchedEndTime) {
            return []
        }
        return getAvailableRooms(
            startDateTime,
            endDateTime,
            roomList,
            selectedScheduleItem,
        )
    }, [currentScheduleItems, selectedLevelDetailState, watchedDate, watchedStartTime, watchedEndTime, roomList])

    useEffect(() => {
        const currentTeachingUnitID = form.getValues("teachingUnitID")
        if (
            currentTeachingUnitID &&
            !teachingUnitByLevel.find(uc => uc.id === currentTeachingUnitID)
        ) {
            form.setValue("teachingUnitID", null)
        }
    }, [teachingUnitByLevel, form])

    useEffect(() => {
        const availableGroupIds = availableGroups.map((g) => g.id)
        const currentlySelected = watchedGroupIds || []
        const validSelected = currentlySelected.filter((id) => availableGroupIds.includes(Number(id)))
        if (!unorderedEqual(validSelected, currentlySelected)) {
            form.setValue("groupIds", validSelected)
        }
    }, [availableGroups, watchedGroupIds, form])

    useEffect(() => {
        const availableTeacherIds = availableTeachers.map((t) => t.id)
        const currentTeacherId = form.getValues("teacherId")
        console.log(currentTeacherId, availableTeacherIds)
        if (
            currentTeacherId === null &&
            selectedTeacherId &&
            availableTeacherIds.includes(selectedTeacherId)
        ) {
            form.setValue("teacherId", selectedTeacherId)
        } else if (
            currentTeacherId &&
            !availableTeacherIds.includes(currentTeacherId)
        ) {
            form.setValue("teacherId", null)
        }
    }, [availableTeachers, form])

    useEffect(() => {
        const availableRoomIds = availableRooms.map((r) => r.id)
        if (form.getValues("roomId") && !availableRoomIds.includes(form.getValues("roomId") || -1)) {
            form.resetField("roomId")
        }
    }, [availableRooms, form]);

    function unorderedEqual(a: string[], b: string[]) {
        return a.length === b.length && a.every((val) => b.includes(val)) && b.every((val) => a.includes(val))
    }

    const selectedRoom = roomList.find((room) => room.id === form.watch("roomId"))
    const selectedGroups = availableGroups.filter((group) => form.watch("groupIds").includes(group.id.toString()))
    const totalGroupSize = selectedGroups.reduce((sum, group) => sum + group.size, 0)
    const capacityError = selectedRoom && totalGroupSize > selectedRoom.capacity

    const isValidDay = (date: Date) => {
        const day = date.getDay()
        return day >= 1 && day <= 6
    }

    const canShowGroup = watchedDate && watchedStartTime && watchedEndTime && selectedLevelDetailState
    const isSubmitDisabled = capacityError || !canShowGroup || Object.keys(form.formState.errors).length > 0

    const handleDelete = () => {
        if (!selectedScheduleItem) return
        deleteScheduleItemService(selectedScheduleItem.id)
            .then((deletedScheduleItemID) => {
                removeScheduleItem(deletedScheduleItemID)
                form.reset()
                setOpen(false)
            })
            .catch((error) => {
                console.error(" Error : ", error)
            })
    }

    const onSubmit = (values: z.infer<typeof ScheduleItemFormSchema>) => {
        if (capacityError) {
            return
        }

        try {
            const [startHour, startMinute] = values.startTime.split(":").map(Number)
            const [endHour, endMinute] = values.endTime.split(":").map(Number)

            const startDateTime = new Date(values.date)
            startDateTime.setHours(startHour, startMinute, 0, 0)

            const endDateTime = new Date(values.date)
            endDateTime.setHours(endHour, endMinute, 0, 0)

            const scheduleItem = ScheduleItemPostSchema.parse({
                TeachingUnitID: values.teachingUnitID,
                TeacherId: values.teacherId,
                RoomId: values.roomId === -1 ? null : values.roomId,
                GroupIds: values.groupIds,
                startTime: startDateTime,
                endTime: endDateTime,
            })

            if (selectedScheduleItem) {
                updateScheduleItemService(selectedScheduleItem.id, scheduleItem)
                    .then((updatedItem) => {
                        updateScheduleItem(selectedScheduleItem.id, updatedItem)
                        form.reset()
                        setOpen(false)
                    })
                    .catch((error) => {
                        console.error(" Error : ", error)
                    })
            } else {
                addScheduleItemService(scheduleItem)
                    .then((scheduleItem) => {
                        addScheduleItem(scheduleItem)
                        form.reset()
                        setOpen(false)
                    })
                    .catch((error) => {
                        console.error(" Error : ", error)
                    })
            }
        } catch (e) {
            console.error(" Error : ", e)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl w-full max-h-[90vh] min-h-[300px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-medium">
                        {selectedScheduleItem ? "Modifier le cours" : "Nouveau cours"}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        {selectedLevelDetails && `Niveau ${selectedLevelDetails.level.name}`}
                    </p>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh] w-full px-2 pb-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-2">
                            <div className="space-y-4">
                                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Période</h3>

                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={`w-full justify-start text-left font-normal ${
                                                                !field.value && "text-muted-foreground"
                                                            }`}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                                            {field.value ? (
                                                                field.value.toLocaleDateString("fr-FR", {
                                                                    weekday: "long",
                                                                    year: "numeric",
                                                                    month: "long",
                                                                    day: "numeric",
                                                                })
                                                            ) : (
                                                                <span>Sélectionner une date</span>
                                                            )}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date: Date) => {
                                                            field.onChange(date)
                                                            setCalendarOpen(false)
                                                        }}
                                                        disabled={(date: Date) => date < new Date() || !isValidDay(date)}
                                                        required
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="startTime"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Début</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="--:--"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {hours.slice(0, -1).map((hour) => (
                                                            <SelectItem key={hour} value={hour}>
                                                                {hour}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="endTime"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Fin</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="--:--"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {hours.map((hour) => (
                                                            <SelectItem key={hour} value={hour}>
                                                                {hour}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Groupes</h3>
                                <Select value={selectedLevelDetailState?.level.id.toString() } onValueChange={(val) =>{
                                    const level = levelDetailsList.find(l => l.level.id.toString() === val) || null
                                    setselectedLevelDetailState(level)
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un niveau"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {levelDetailsList.length > 0 ? levelDetailsList.map((levelDetails) => (
                                            <SelectItem key={levelDetails.level.id} value={levelDetails.level.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{levelDetails.level.name}</span>
                                                    <span>{levelDetails.level.name}</span>
                                                </div>
                                            </SelectItem>
                                        )) : <div className="p-2 text-sm text-muted-foreground">Aucun niveau disponible</div>}
                                    </SelectContent>
                                </Select>
                                <FormField
                                    control={form.control}
                                    name="groupIds"
                                    render={() => (
                                        <FormItem>
                                            {canShowGroup ? (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-muted-foreground">
                                                        {availableGroups.length} groupe(s) disponible(s)
                                                    </p>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {availableGroups.map((group) => (
                                                            <FormField
                                                                key={group.id}
                                                                control={form.control}
                                                                name="groupIds"
                                                                render={({field}) => {
                                                                    return (
                                                                        <FormItem
                                                                            className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                                                            <FormControl>
                                                                                <Checkbox
                                                                                    checked={
                                                                                        Array.isArray(field.value) && field.value.includes(group.id.toString())
                                                                                    }
                                                                                    onCheckedChange={(checked) => {
                                                                                        const newValue = checked
                                                                                            ? [...field.value, group.id.toString()]
                                                                                            : field.value.filter((id) => id !== group.id.toString())
                                                                                        field.onChange(newValue)
                                                                                    }}
                                                                                />
                                                                            </FormControl>
                                                                            <div className="flex-1">
                                                                                <div
                                                                                    className="flex items-center justify-between">
                                                                                    <div>
                                                                                        <span
                                                                                            className="font-medium">{group.name}</span>
                                                                                        <span
                                                                                            className="text-muted-foreground ml-2">({group.name})</span>
                                                                                    </div>
                                                                                    <span
                                                                                        className="text-sm text-muted-foreground">{group.size} étudiants</span>
                                                                                </div>
                                                                            </div>
                                                                        </FormItem>
                                                                    )
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-muted-foreground">
                                                    <Users className="h-8 w-8 mx-auto mb-3 opacity-50"/>
                                                    <p className="text-sm">Définissez la période et le niveau pour voir les groupes
                                                        disponibles</p>
                                                </div>
                                            )}
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Détails
                                    du cours</h3>
                                {canShowGroup ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="teachingUnitID"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Unité de cours</FormLabel>
                                                        <Select
                                                            onValueChange={(val) => field.onChange(Number(val))}
                                                            value={field.value?.toString() || ""}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionner"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {teachingUnitByLevel.map((uc) => (
                                                                    <SelectItem key={uc.id} value={uc.id.toString()}>
                                                                        <div className="flex items-center gap-2">
                                                                            <span
                                                                                className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{uc.abr}</span>
                                                                            <span>{uc.name}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="teacherId"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Enseignant</FormLabel>
                                                        <Select
                                                            onValueChange={(val) => field.onChange(Number(val))}
                                                            value={field.value?.toString() || ""}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionner"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {availableTeachers.map((teacher) => (
                                                                    <SelectItem key={teacher.id}
                                                                                value={teacher.id.toString()}>
                                                                        <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                    {teacher.abr}
                                  </span>
                                                                            <span>{teacher.name}</span>
                                                                        </div>
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="roomId"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Salle</FormLabel>
                                                    <Select
                                                        onValueChange={(val) => field.onChange(Number(val))}
                                                        value={field.value?.toString() || ""}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionner une salle"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={"-1"}>
                                                                <div className="flex items-center gap-2">
                                                                    <span>Aucune</span>
                                                                </div>
                                                            </SelectItem>
                                                            {availableRooms.map((room) => (
                                                                <SelectItem key={room.id} value={room.id.toString()}>
                                                                    <div
                                                                        className="flex items-center justify-between w-full">
                                                                        <div className="flex items-center gap-2">
                                                                            <span
                                                                                className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{room.abr}</span>
                                                                            <span>{room.name}</span>
                                                                        </div>
                                                                        <span
                                                                            className="text-xs text-muted-foreground ml-4">{room.capacity} places</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-50"/>
                                        <p className="text-sm">Définissez la période et le niveau pour configurer les détails du
                                            cours</p>
                                    </div>
                                )}

                            </div>

                            {selectedGroups.length > 0 && selectedRoom && (
                                <div
                                    className={`p-3 rounded-lg text-sm ${
                                        capacityError
                                            ? "bg-destructive/10 text-destructive border border-destructive/20"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    {capacityError ? (
                                        <span>
                      ⚠️ Capacité insuffisante: {totalGroupSize} étudiants pour {selectedRoom.capacity} places
                    </span>
                                    ) : (
                                        <span>
                      ✓ {totalGroupSize} étudiants • {selectedRoom.capacity} places disponibles
                    </span>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-between pt-6 border-t">
                                {selectedScheduleItem && (
                                    <Button type="button" variant="destructive" onClick={handleDelete}>
                                        Supprimer
                                    </Button>
                                )}

                                <div className="flex gap-3 ml-auto">
                                    <Button type="button" variant="outline" onClick={() => {
                                        setselectedLevelDetailState(selectedLevelDetails)
                                        form.reset()
                                    }}>
                                        Réinitialiser
                                    </Button>
                                    <Button type="submit" disabled={isSubmitDisabled}>
                                        {selectedScheduleItem ? "Modifier" : "Créer"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
)
}
