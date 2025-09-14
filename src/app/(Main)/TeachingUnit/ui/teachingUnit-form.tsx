import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Check, RotateCcw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {TeachingUnit, TeachingUnitPost, TeachingUnitPostSchema} from "@/Types/TeachingUnit";
import z from "zod";
import {useEffect} from "react";
import {AddTeachingUnitService, UpdateTeachingUnitService} from "@/services/TeachingUnit";
import {useTeachingUnitStore} from "@/Stores/TeachingUnit";
import {useLevelStore} from "@/Stores/Level";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface IProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedLevelID: number | null;
    selectedTeachingUnit?: TeachingUnit | null;
}


export default function TeachingUnitForm({isOpen, setIsOpen, selectedLevelID, selectedTeachingUnit}: IProps) {
    const AddTeachingUnitInStore = useTeachingUnitStore(s => s.addTeachingUnit);
    const UpadateTeachingUnitInStore = useTeachingUnitStore(s => s.updateTeachingUnit);
    const Levels = useLevelStore(s => s.levels);

    const defaultValues = {
        name: selectedTeachingUnit?.name || "",
        abr: selectedTeachingUnit?.abr || "",
        associatedLevels: selectedTeachingUnit?.associatedLevels || selectedLevelID,
    };

    const form = useForm<z.infer<typeof TeachingUnitPostSchema>>({
        resolver: zodResolver(TeachingUnitPostSchema),
        defaultValues: defaultValues,
    })

    useEffect(() => {
        form.reset(defaultValues);
    }, [selectedLevelID, selectedTeachingUnit]);

    const selectedLevelsObj = Levels?.find(level => level.id === selectedLevelID);

    const onSubmit = (data: TeachingUnitPost) => {
        if(selectedTeachingUnit){
            UpdateTeachingUnitService(selectedTeachingUnit.id, data)
                .then((updatedTeachingUnit) => {
                    UpadateTeachingUnitInStore(updatedTeachingUnit);
                    setIsOpen(false);
                    form.reset();
                })
                .catch((error) => {
                    console.error("Failed to update teaching unit:", error);
            })
        }else{
            AddTeachingUnitService(data)
                .then((newTeachingUnit) => {
                    AddTeachingUnitInStore(newTeachingUnit);
                    setIsOpen(false);
                    form.reset();
                })
                .catch((error) => {
                    console.error("Failed to add teaching unit:", error);
                })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={"w-full max-h-[90vh] min-h-[300px]"}>
                <DialogHeader>
                    <DialogTitle>{selectedTeachingUnit ? "Modifier" : "Ajouter"} Matière {selectedLevelsObj?.name}</DialogTitle>
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
                                            <Input placeholder={"Nom de la matière"} value={field.value}
                                                   onChange={field.onChange}/>
                                        </FormControl>
                                        <FormDescription>
                                            Le nom complet de la matière.
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
                                            <Input placeholder={"Abréviation de la matière"} value={field.value}
                                                   onChange={field.onChange}/>
                                        </FormControl>
                                        <FormDescription>
                                            L'abréviation de la matière.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            { selectedTeachingUnit !== null && (
                                <FormField
                                    control={form.control}
                                    name="associatedLevels"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="flex items-center gap-2">
                                                Associé au niveau
                                            </FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange}
                                                        value={field.value.toString() || ""}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue
                                                                placeholder="Sélectionner un niveau"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Levels?.map((level) => (
                                                            <SelectItem key={level.id}
                                                                        value={level.id.toString()}>
                                                                {level.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>
                                                L'abréviation de la matière.
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}/>
                            )}
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