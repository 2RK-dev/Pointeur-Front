import {Teacher, TeacherPost, TeacherPostSchema} from "@/Types/Teacher";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Check, RotateCcw} from "lucide-react";
import {addTeacher, updateTeacher} from "@/services/Teacher";
import {useTeacherStore} from "@/Stores/Teacher";
import {notifications} from "@/components/notifications";

interface Props {
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
    selectedTeacher: Teacher | null
}

export default function TeacherForm({isOpen, setIsOpen, selectedTeacher}: Props) {
    const addTeacherInStore = useTeacherStore((s) => s.addTeacher);
    const updateTeacherInStore = useTeacherStore((s) => s.updateTeacher);
    const defaultValues = {
        name: selectedTeacher?.name || "",
        abr: selectedTeacher?.abr || "",
    }
    const form = useForm<TeacherPost>({
        resolver: zodResolver(TeacherPostSchema),
        defaultValues: defaultValues,
    })

    useEffect(() => {
        form.reset(defaultValues)
    }, [selectedTeacher]);

    const onSubmit = (data: TeacherPost) => {
        if (selectedTeacher) {
            updateTeacher(selectedTeacher.id, data).then((updatedTeacher) => {
                updateTeacherInStore(selectedTeacher.id, updatedTeacher);
                form.reset();
                setIsOpen(false);
                notifications.success("Enseignant mis à jour avec succès", " L'enseignant N°" + updatedTeacher.id + " - " + updatedTeacher.name + " a été mis à jour.");
            }).catch((err) => {
                notifications.error("Erreur lors de la mise à jour de l'enseignant", err.message);
            })
        } else {
            addTeacher(data).then((newTeacher) => {
                addTeacherInStore(newTeacher);
                form.reset();
                setIsOpen(false);
                notifications.success('Enseignant ajouté avec succès', ' L\'enseignant ' + newTeacher.id + ' - ' + newTeacher.name + ' a été ajouté.');
            }).catch((err) => {
                notifications.error("Erreur lors de l'ajout de l'enseignant", err.message);
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={"w-full max-h-[90vh] min-h-[300px]"}>
                <DialogHeader>
                    <DialogTitle>{selectedTeacher ? "Modifier" : "Nouvel"} enseignant </DialogTitle>
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
                                            Le nom complet de l'enseignant.
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
                                            L'abréviation de l'enseignant.
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