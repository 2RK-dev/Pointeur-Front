import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Check, RotateCcw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {addRoomService, updateRoomService} from "@/services/Room";
import {Room, RoomPost, RoomPostSchema} from "@/Types/Room";
import {useRoomsStore} from "@/Stores/Room";
import {useEffect} from "react";

interface Props {
    isFormOpen: boolean
    setIsFormOpen: (isOpen: boolean) => void
    selectedRoom: Room | null
}

export default function RoomForm({isFormOpen, setIsFormOpen, selectedRoom}: Props) {
    const addRoomInStore = useRoomsStore((s) => s.addRoom)
    const updateRoomInStore = useRoomsStore((s) => s.updateRoom)
    const defaultValues = {
        name: selectedRoom?.name || "",
        abr: selectedRoom?.abr || "",
        capacity: selectedRoom?.capacity || 0,
    }
    const form = useForm<z.infer<typeof RoomPostSchema>>({
        resolver: zodResolver(RoomPostSchema),
        defaultValues: defaultValues,
    })

    useEffect(() => {
        form.reset(defaultValues);
    }, [selectedRoom]);

    const onSubmit = (roomData: RoomPost) => {
        if(selectedRoom){
            updateRoomService(selectedRoom.id, roomData).then((updatedRoom) => {
                updateRoomInStore(selectedRoom.id,updatedRoom);
                form.reset();
                setIsFormOpen(false);
            }).catch((error) => {
                console.error("Error updating room:", error);
            })
        }else{
            addRoomService(roomData).then((newRoom) => {
                addRoomInStore(newRoom);
                form.reset();
                setIsFormOpen(false);
            }).catch((error) => {
                console.error("Error adding room:", error);
            })
        }
    }

    return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className={"w-full max-h-[90vh] min-h-[300px]"}>
                <DialogHeader>
                    <DialogTitle>{selectedRoom ? "Modifier" : "Nouvelle"} Salle</DialogTitle>
                </DialogHeader>
                <ScrollArea className={"max-h-[80vh] w-full"}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-2 my-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="flex items-center gap-2">
                                            Nom
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder={"Nom de la salle"} value={field.value}
                                                   onChange={field.onChange}/>
                                        </FormControl>
                                        <FormDescription>
                                            Le nom complet de la salle.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            <FormField
                                control={form.control}
                                name="abr"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="flex items-center gap-2">
                                            Abréviation
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder={"Abréviation"} value={field.value}
                                                   onChange={field.onChange}/>
                                        </FormControl>
                                        <FormDescription>
                                            L'abréviation de la salle.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="flex items-center gap-2">
                                            Capacité
                                        </FormLabel>
                                        <FormControl>
                                            <Input type={"number"} placeholder={"Capacité"} min={0} value={field.value}
                                                   onChange={e => field.onChange(Number(e.target.value))}/>
                                        </FormControl>
                                        <FormDescription>
                                            La capacité maximale de la salle.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            <div className="flex flex-row justify-end gap-2 mt-2 ">
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    onClick={() => {
                                        form.reset()
                                    }}>
                                    <RotateCcw/>
                                </Button>
                                <Button
                                    type="submit">
                                    <Check/>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
