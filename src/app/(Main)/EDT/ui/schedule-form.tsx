"use client"

import {useEffect, useMemo, useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {BookOpen, CalendarIcon, Check, Clock, MapPin, RotateCcw, Trash2, User, Users} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"
import {Badge} from "@/components/ui/badge"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {TeachingUnit} from "@/Types/TeachingUnit";
import {getTeachingUnits} from "@/services/TeachingUnit";
import {Teacher} from "@/Types/Teacher";
import {getTeachers} from "@/services/Teacher";
import {Room} from "@/Types/Room";
import {getRooms} from "@/services/Room";
import {getAvailableGroups} from "@/Tools/Group";
import {generateHours} from "@/Tools/ScheduleItem";
import {
    useCurrentScheduleItemsStore,
    useOpenScheduleItemFormStore,
    useSelectedScheduleItemStore
} from "@/Stores/ScheduleItem";
import {useCurrentLevelStore} from "@/Stores/Level";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {addScheduleItemService, deleteScheduleItemService, updateScheduleItemService} from "@/services/ScheduleItem";
import {ScheduleItemPostSchema} from "@/Types/ScheduleItem";

const hours = generateHours();

const ScheduleItemFormSchema = z
    .object({
        date: z.date({
            required_error: "Veuillez sélectionner une date",
        }),
        startTime: z.string().min(1, "Veuillez sélectionner l'heure de début"),
        endTime: z.string().min(1, "Veuillez sélectionner l'heure de fin"),
        teachingUnitID: z.number({
            required_error: "Veuillez sélectionner une unité de cours",
        }),
        teacherId: z.number({
            required_error: "Veuillez sélectionner un enseignant",
        }),
        roomId: z.number({
            required_error: "Veuillez sélectionner une salle",
        }),
        groupIds: z.array(z.string()).min(1, "Veuillez sélectionner au moins un groupe"),
    })


export default function ScheduleForm() {
    const {open, setOpen} = useOpenScheduleItemFormStore();
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [teachingUnits, setTeachingUnits] = useState<TeachingUnit[]>([])
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [rooms, setRooms] = useState<Room[]>([]);
    const currentScheduleItems = useCurrentScheduleItemsStore((s) => s.currentScheduleItems);
    const addScheduleItem = useCurrentScheduleItemsStore((s) => s.addScheduleItem);
    const updateScheduleItem = useCurrentScheduleItemsStore((s) => s.updateScheduleItem);
    const removeScheduleItem = useCurrentScheduleItemsStore((s) => s.removeScheduleItem);
    const {currentLevel} = useCurrentLevelStore();
    const selectedScheduleItem = useSelectedScheduleItemStore((s) => s.selectedScheduleItem);

    const defaultValues = {
        date: selectedScheduleItem?.startTime || undefined,
        startTime: selectedScheduleItem?.startTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }) || undefined,
        endTime: selectedScheduleItem?.endTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }) || undefined,
        teachingUnitID: selectedScheduleItem?.TeachingUnit.id || undefined,
        teacherId: selectedScheduleItem?.Teacher.id || undefined,
        roomId: selectedScheduleItem?.Room.id || undefined,
        groupIds: selectedScheduleItem?.Groups.map((grp) => grp.id.toString()) || [],
    }
    const form = useForm<z.infer<typeof ScheduleItemFormSchema>>({
        resolver: zodResolver(ScheduleItemFormSchema),
        defaultValues: defaultValues,
    })

    useEffect(() => {
        form.reset(defaultValues);
    }, [selectedScheduleItem]);

    const watchedDate = form.watch("date")
    const watchedStartTime = form.watch("startTime")
    const watchedEndTime = form.watch("endTime")
    const watchedGroupIds = form.watch("groupIds")

    useEffect(() => {
        getTeachingUnits().then((units) => {
            setTeachingUnits(units);
        }).catch((error) => {
            console.error("Erreur lors de la récupération des unités de cours :", error);
        })

        getTeachers().then((teachersData) => {
            setTeachers(teachersData);
        }).catch((error) => {
            console.error("Erreur lors de la récupération des enseignants :", error);
        })

        getRooms().then((roomsData) => {
            setRooms(roomsData);
        }).catch((error) => {
            console.error("Erreur lors de la récupération des salles :", error);
        })
    }, [])

    useEffect(() => {
        if (watchedStartTime && watchedEndTime) {
            const [startHour, startMinute] = watchedStartTime.split(":").map(Number);
            const [endHour, endMinute] = watchedEndTime.split(":").map(Number);

            const startTotalMinutes = startHour * 60 + startMinute;
            const endTotalMinutes = endHour * 60 + endMinute;

            if (startTotalMinutes >= endTotalMinutes) {
                form.setError("endTime", {message: "L'heure de fin doit être après l'heure de début"});
            } else {
                form.clearErrors("endTime");
            }
        } else {
            form.clearErrors("endTime");
        }
    }, [watchedStartTime, watchedEndTime, form])


    const startDateTime = new Date(watchedDate);
    if (watchedStartTime) {
        const [startHour, startMinute] = watchedStartTime.split(":").map(Number);
        startDateTime.setHours(startHour, startMinute, 0, 0);
    }

    const endDateTime = new Date(watchedDate);
    if (watchedEndTime) {
        const [endHour, endMinute] = watchedEndTime.split(":").map(Number);
        endDateTime.setHours(endHour, endMinute, 0, 0);
    }

    const availableGroups = useMemo(() => {
        if (!currentLevel || !watchedDate || !watchedStartTime || !watchedEndTime) {
            return [];
        }
        return getAvailableGroups(
            currentScheduleItems,
            currentLevel.groups,
            startDateTime,
            endDateTime,
            selectedScheduleItem
        );


    }, [currentScheduleItems, currentLevel?.groups, startDateTime, endDateTime]);

    useEffect(() => {
        const availableGroupIds = availableGroups.map((g) => g.id);
        const currentlySelected = watchedGroupIds || [];
        const validSelected = currentlySelected.filter((id) =>
            availableGroupIds.includes(Number(id))
        );
        if (!unorderedEqual(validSelected, currentlySelected)) {
            form.setValue("groupIds", validSelected);
        }
    }, [availableGroups, watchedGroupIds, form]);

    function unorderedEqual(a: string[], b: string[]) {
        return a.length === b.length &&
            a.every(val => b.includes(val)) &&
            b.every(val => a.includes(val));
    }

    const selectedRoom = rooms.find((room) => room.id === form.watch("roomId"))
    const selectedGroups = availableGroups.filter((group) => form.watch("groupIds").includes(group.id.toString()))
    const totalGroupSize = selectedGroups.reduce((sum, group) => sum + group.size, 0)
    const capacityError = selectedRoom && totalGroupSize > selectedRoom.capacity

    const isValidDay = (date: Date) => {
        const day = date.getDay()
        return day >= 1 && day <= 6
    }

    const isPeriodComplete = watchedDate && watchedStartTime && watchedEndTime

    const isSubmitDisabled = capacityError || !isPeriodComplete || Object.keys(form.formState.errors).length > 0;

    const handleDelete = () => {
        if (!selectedScheduleItem) return;
        deleteScheduleItemService(selectedScheduleItem.id).then((deletedScheduleItem) => {
            removeScheduleItem(deletedScheduleItem.id);
            form.reset();
            setOpen(false);
        }).catch((error) => {
            console.error(" Error : ", error);
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
                RoomId: values.roomId,
                GroupIds: values.groupIds,
                startTime: startDateTime,
                endTime: endDateTime,
            })
            if (selectedScheduleItem) {
                updateScheduleItemService(selectedScheduleItem.id, scheduleItem).then((updatedItem) => {
                    updateScheduleItem(selectedScheduleItem.id, updatedItem);
                    form.reset();
                    setOpen(false);
                }).catch((error) => {
                    console.error(" Error : ", error);
                })
            } else {
                addScheduleItemService(scheduleItem).then((scheduleItem) => {
                    addScheduleItem(scheduleItem);
                    form.reset();
                    setOpen(false);
                }).catch((error) => {
                    console.error(" Error : ", error);
                })
            }

        } catch (e) {
            console.error(" Error : ", e);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={"max-w-2xl w-full max-h-[90vh] min-h-[300px]"}>
                <DialogHeader>
                    <DialogTitle>Planification pour le niveau {currentLevel?.name}</DialogTitle>
                </DialogHeader>
                <ScrollArea className={"max-h-[80vh] w-full"}>
                    <div className="p-4">
                        <div className="max-w-2xl mx-auto">
                            <Card className="shadow-xl border-0">
                                <CardContent className="p-6">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            <Card className="border-2 border-blue-200 bg-blue-50/50">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                        <div
                                                            className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                            1
                                                        </div>
                                                        Définir la période
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Sélectionnez d'abord la date et les heures pour voir les groupes
                                                        disponibles
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name="date"
                                                        render={({field}) => (
                                                            <FormItem className="flex flex-col">
                                                                <FormLabel className="flex items-center gap-2">
                                                                    <CalendarIcon className="h-4 w-4 text-red-600"/>
                                                                    Date du cours
                                                                </FormLabel>
                                                                <Popover open={calendarOpen}
                                                                         onOpenChange={setCalendarOpen}>
                                                                    <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button
                                                                                variant="outline"
                                                                                className={`w-full pl-3 text-left font-normal ${
                                                                                    !field.value && "text-muted-foreground"
                                                                                }`}
                                                                            >
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
                                                                                <CalendarIcon
                                                                                    className="ml-auto h-4 w-4 opacity-50"/>
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0"
                                                                                    align="start">
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
                                                                <FormDescription>Seuls les jours de lundi à samedi sont
                                                                    disponibles</FormDescription>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="startTime"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="flex items-center gap-2">
                                                                        <Clock className="h-4 w-4 text-blue-600"/>
                                                                        Heure de début
                                                                    </FormLabel>
                                                                    <Select onValueChange={field.onChange}
                                                                            value={field.value || ""}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue
                                                                                    placeholder="Heure de début"/>
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
                                                                    <FormLabel className="flex items-center gap-2">
                                                                        <Clock className="h-4 w-4 text-red-600"/>
                                                                        Heure de fin
                                                                    </FormLabel>
                                                                    <Select onValueChange={field.onChange}
                                                                            value={field.value || ""}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue
                                                                                    placeholder="Heure de fin"/>
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
                                                </CardContent>
                                            </Card>

                                            <Card
                                                className={`border-2 ${isPeriodComplete ? "border-green-200 bg-green-50/50" : "border-gray-200 bg-gray-50/50"}`}
                                            >
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                        <div
                                                            className={`w-6 h-6 ${isPeriodComplete ? "bg-green-600" : "bg-gray-400"} text-white rounded-full flex items-center justify-center text-sm font-bold`}
                                                        >
                                                            2
                                                        </div>
                                                        Sélectionner les groupes
                                                        {!isPeriodComplete &&
                                                            <Badge variant="secondary">Définissez d'abord la
                                                                période</Badge>}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <FormField
                                                        control={form.control}
                                                        name="groupIds"
                                                        render={() => (
                                                            <FormItem>
                                                                <FormLabel className="flex items-center gap-2">
                                                                    <Users className="h-4 w-4 text-orange-600"/>
                                                                    Groupes d'étudiants disponibles
                                                                </FormLabel>
                                                                <FormDescription>
                                                                    {isPeriodComplete
                                                                        ? `${availableGroups.length} groupe(s) disponible(s) pour cette période`
                                                                        : "Sélectionnez une période pour voir les groupes disponibles"}
                                                                </FormDescription>

                                                                {isPeriodComplete ? (
                                                                    <div
                                                                        className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                        {availableGroups.map((group) => (
                                                                            <FormField
                                                                                key={group.id}
                                                                                control={form.control}
                                                                                name="groupIds"
                                                                                render={({field}) => {
                                                                                    return (
                                                                                        <FormItem
                                                                                            key={group.id}
                                                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                                                        >
                                                                                            <FormControl>
                                                                                                <Checkbox
                                                                                                    checked={Array.isArray(field.value) && field.value.includes(group.id.toString())}
                                                                                                    onCheckedChange={(checked) => {
                                                                                                        const newValue = checked
                                                                                                            ? [...field.value, group.id.toString()]
                                                                                                            : field.value.filter((id) => id !== group.id.toString())
                                                                                                        field.onChange(newValue)
                                                                                                    }}
                                                                                                />
                                                                                            </FormControl>
                                                                                            <div
                                                                                                className="space-y-1 leading-none">
                                                                                                <div
                                                                                                    className="flex items-center gap-2">
                                                                                                    <Badge
                                                                                                        variant="outline">{group.abr}</Badge>
                                                                                                    <span
                                                                                                        className="text-sm font-medium">{group.name}</span>
                                                                                                </div>
                                                                                                <p className="text-xs text-muted-foreground">{group.size} étudiants</p>
                                                                                            </div>
                                                                                        </FormItem>
                                                                                    )
                                                                                }}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center py-8 text-gray-500">
                                                                        <Users
                                                                            className="h-12 w-12 mx-auto mb-2 opacity-50"/>
                                                                        <p>Définissez la période pour voir les groupes
                                                                            disponibles</p>
                                                                    </div>
                                                                )}
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </CardContent>
                                            </Card>

                                            <Card
                                                className={`border-2 ${isPeriodComplete ? "border-purple-200 bg-purple-50/50" : "border-gray-200 bg-gray-50/50"}`}
                                            >
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                        <div
                                                            className={`w-6 h-6 ${isPeriodComplete ? "bg-purple-600" : "bg-gray-400"} text-white rounded-full flex items-center justify-center text-sm font-bold`}
                                                        >
                                                            3
                                                        </div>
                                                        Informations du cours
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="teachingUnitID"
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel className="flex items-center gap-2">
                                                                        <BookOpen className="h-4 w-4 text-blue-600"/>
                                                                        Unité de Cours
                                                                    </FormLabel>
                                                                    <Select
                                                                        onValueChange={(val) => field.onChange(Number(val))}
                                                                        value={field.value?.toString() || ""}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue
                                                                                    placeholder="Sélectionner une UC"/>
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {teachingUnits.map((uc) => (
                                                                                <SelectItem key={uc.id}
                                                                                            value={uc.id.toString()}>
                                                                                    <div
                                                                                        className="flex items-center gap-2">
                                                                                        <Badge
                                                                                            variant="secondary">{uc.abr}</Badge>
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
                                                                    <FormLabel className="flex items-center gap-2">
                                                                        <User className="h-4 w-4 text-green-600"/>
                                                                        Enseignant
                                                                    </FormLabel>
                                                                    <Select
                                                                        onValueChange={(val) => field.onChange(Number(val))}
                                                                        value={field.value?.toString() || ""}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue
                                                                                    placeholder="Sélectionner un enseignant"/>
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            {teachers.map((teacher) => (
                                                                                <SelectItem key={teacher.id}
                                                                                            value={teacher.id.toString()}>
                                                                                    <div
                                                                                        className="flex items-center gap-2">
                                                                                        <Badge
                                                                                            variant="outline">{teacher.abr}</Badge>
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
                                                                <FormLabel className="flex items-center gap-2">
                                                                    <MapPin className="h-4 w-4 text-purple-600"/>
                                                                    Salle
                                                                </FormLabel>
                                                                <Select
                                                                    onValueChange={(val) => field.onChange(Number(val))}
                                                                    value={field.value?.toString() || ""}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue
                                                                                placeholder="Sélectionner une salle"/>
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {rooms.map((room) => (
                                                                            <SelectItem key={room.id}
                                                                                        value={room.id.toString()}>
                                                                                <div
                                                                                    className="flex items-center justify-between w-full">
                                                                                    <div
                                                                                        className="flex items-center gap-2">
                                                                                        <Badge
                                                                                            variant="outline">{room.abr}</Badge>
                                                                                        <span>{room.name}</span>
                                                                                    </div>
                                                                                    <Badge variant="secondary"
                                                                                           className="ml-2">
                                                                                        {room.capacity} places
                                                                                    </Badge>
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </CardContent>
                                            </Card>

                                            {capacityError && (
                                                <Alert variant="destructive">
                                                    <AlertDescription>
                                                        ⚠️ La capacité de la salle ({selectedRoom?.capacity} places) est
                                                        insuffisante pour accueillir tous
                                                        les étudiants sélectionnés ({totalGroupSize} étudiants).
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {selectedGroups.length > 0 && !capacityError && (
                                                <Alert>
                                                    <AlertDescription>
                                                        ✅ Total: {totalGroupSize} étudiants - Capacité
                                                        salle: {selectedRoom?.capacity || 0} places
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            <div className="flex flex-row justify-between items-center mt-4">
                                                {selectedScheduleItem ? (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={handleDelete}
                                                    >
                                                        <Trash2/>
                                                    </Button>
                                                ) : <div/>}
                                                <div className={"flex flex-row gap-2 mt-2"}>
                                                    <Button
                                                        type="button"
                                                        variant={"outline"}
                                                        onClick={() => {
                                                            form.reset()
                                                        }}
                                                    >
                                                        <RotateCcw/>
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={isSubmitDisabled}
                                                    >
                                                        <Check/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>

    )
}
