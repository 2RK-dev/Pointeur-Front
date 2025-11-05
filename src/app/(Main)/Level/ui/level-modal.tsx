"use client"

import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {LevelDTO, LevelPostDTO, LevelPostDTOSchema} from "@/Types/LevelDTO"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField} from "@/components/ui/form";
import {useEffect} from "react";

interface LevelModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedLevel: LevelDTO | null
    handleAddLevel : (levelPost: LevelPostDTO) => void
    handleUpdateLevel: (levelId: number, levelPost: LevelPostDTO) => void
}

export function LevelModal({open, onOpenChange, selectedLevel, handleUpdateLevel, handleAddLevel}: LevelModalProps) {
    const defaultValues = {
        name: selectedLevel?.name || "",
        abr: selectedLevel?.abr || "",
    }
    const form = useForm<LevelPostDTO>({
        resolver: zodResolver(LevelPostDTOSchema),
        defaultValues: defaultValues,
    })

    const mode = selectedLevel ? "edit" : "create";

    useEffect(() => {
        form.reset(defaultValues)
    }, [selectedLevel]);

    const handleSubmit = form.handleSubmit((data) => {
        if (mode === "edit" && selectedLevel) {
            handleUpdateLevel(selectedLevel.id, data);
        } else {
            handleAddLevel(data);
        }
        onOpenChange(false);
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Modifier le niveau" : "Nouveau niveau"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name={"name"}
                                render={({field})=>(
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nom du niveau</Label>
                                        <Input
                                            id="name"
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="ex: Licence 1"
                                            required
                                        />
                                    </div>
                                )} />
                            <FormField
                                name={"abr"}
                                render={({field})=>(
                                <div className="grid gap-2">
                                    <Label htmlFor="abbreviation">Abréviation</Label>
                                    <Input
                                        id="abbreviation"
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="ex: L1"
                                        required
                                    />
                                </div>
                            )} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Annuler
                            </Button>
                            <Button type="submit">{selectedLevel ? "Enregistrer" : "Créer"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
