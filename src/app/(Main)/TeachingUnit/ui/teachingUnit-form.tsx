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
import {useEffect, useState} from "react";
import {AddTeachingUnitService, UpdateTeachingUnitService} from "@/services/TeachingUnit";
import {useTeachingUnitStore} from "@/Stores/TeachingUnit";
import {useLevelStore} from "@/Stores/Level";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {notifications} from "@/components/notifications";

interface IProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedLevelID: number | null;
    selectedTeachingUnit?: TeachingUnit | null;
}


export default function TeachingUnitForm({isOpen, setIsOpen, selectedLevelID, selectedTeachingUnit}: IProps) {
    const AddTeachingUnitInStore = useTeachingUnitStore(s => s.addTeachingUnit);
    const UpdateTeachingUnitInStore = useTeachingUnitStore(s => s.updateTeachingUnit);
    const Levels = useLevelStore(s => s.levelsDetails);
    const defaultChecked = selectedTeachingUnit ? selectedTeachingUnit.associatedLevels !== null : true;
    const [isAssociated, setIsAssociated] = useState<boolean>(defaultChecked);


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
        setIsAssociated(defaultChecked);
    }, [selectedLevelID, selectedTeachingUnit]);

    const selectedLevelsObj = Levels?.find(level => level.level.id === selectedLevelID);

    const onSubmit = (data: TeachingUnitPost) => {
        if(!isAssociated){
            data.associatedLevels = null;
        }
        if (selectedTeachingUnit) {
            const promise = UpdateTeachingUnitService(selectedTeachingUnit.id, data)
                .then((updatedTeachingUnit) => {
                    UpdateTeachingUnitInStore(updatedTeachingUnit.id, updatedTeachingUnit);
                    setIsOpen(false);
                    form.reset();
                    notifications.success("Matière mise à jour avec succès","La matière N°" + updatedTeachingUnit.id + " - "+updatedTeachingUnit.name +" a été mise à jour.");
                })
                .catch((error) => {
                    notifications.error("Échec de la mise à jour de la matière", error.message);
                })
            notifications.promise(promise, {
                loading: "Mise à jour de la matière en cours...",
                success: "Matière mise à jour avec succès !",
                error: "Échec de la mise à jour de la matière."
            })
        } else {
            const promise = AddTeachingUnitService(data)
                .then((newTeachingUnit) => {
                    AddTeachingUnitInStore(newTeachingUnit);
                    setIsOpen(false);
                    form.reset();
                    notifications.success("Matière ajoutée avec succès","La matière N°" + newTeachingUnit.id + " - "+newTeachingUnit.name +" a été ajoutée.");
                })
                .catch((error) => {
                    notifications.error("Échec de l'ajout de la matière", error.message);
                })
            notifications.promise(promise, {
                loading: "Ajout de la matière en cours...",
                success: "Matière ajoutée avec succès !",
                error: "Échec de l'ajout de la matière."
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={"w-full max-h-[90vh] min-h-[300px]"}>
                <DialogHeader>
                    <DialogTitle>{selectedTeachingUnit ? "Modifier" : "Ajouter"} Matière {selectedLevelsObj?.level.name}</DialogTitle>
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
                            {selectedTeachingUnit !== null && (
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="associatedLevels"
                                        render={({field}) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="flex items-center gap-2">
                                                    Associé au niveau
                                                </FormLabel>
                                                <FormControl>
                                                        <Select disabled={!isAssociated}
                                                            onValueChange={(value) => {
                                                            field.onChange(value ? parseInt(value) : null)
                                                        }}
                                                                value={field.value?.toString() || ""}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue
                                                                        placeholder="Sélectionner un niveau"/>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {Levels?.map((level) => (
                                                                    <SelectItem key={level.level.id}
                                                                                value={level.level.id.toString()}>
                                                                        {level.level.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                </FormControl>
                                                <FormDescription>
                                                    Le niveau auquel cette unité d'enseignement est associée.
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}/>
                                </div>
                            )}
                            <Label
                                className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                                <Checkbox
                                    id="toggle-2"
                                    checked={!isAssociated}
                                    onCheckedChange={(checked)=>{
                                        setIsAssociated(!checked);
                                    }}
                                    className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                />
                                <div className="grid gap-1.5 font-normal">
                                    <p className="text-sm leading-none font-medium">
                                        Ne pas associer à un niveau
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        La matière sera associée à tous les niveaux.
                                    </p>
                                </div>
                            </Label>
                            <div className="flex flex-row justify-end gap-2 mt-2 ">
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    onClick={() => {
                                        form.reset();
                                        setIsAssociated(defaultChecked);
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