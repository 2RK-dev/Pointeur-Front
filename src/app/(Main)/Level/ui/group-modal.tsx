"use client"

import type React from "react"
import {useEffect} from "react"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {GroupDTO, GroupDTOSchema, GroupPost} from "@/Types/GroupDTO";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField} from "@/components/ui/form";

interface GroupModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectGroup: GroupDTO | null
    handleAddGroup:(groupPost: GroupPost) => void
    handleUpdateGroup:(groupId:number, groupPost: GroupPost) => void
}

const listOfTypes = ["TD", "TP", "CM", "Projet"]

export function GroupModal({open, onOpenChange, selectGroup, handleUpdateGroup, handleAddGroup}: GroupModalProps) {
    const mode = selectGroup ? "edit" : "create";
    const defaultValue = {
        name: selectGroup?.name || "",
        type: selectGroup?.type || "",
        classe: selectGroup?.classe || "",
        size: selectGroup?.size || 0,
    }

    const form = useForm<GroupPost>({
        resolver: zodResolver(GroupDTOSchema),
        defaultValues: defaultValue
    })

    useEffect(() => {
        form.reset(defaultValue);
    }, [selectGroup])

    const handleSubmit = form.handleSubmit((data) => {
        if (mode === "edit" && selectGroup) {
            handleUpdateGroup(selectGroup.id, data);
        } else {
            handleAddGroup(data);
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{selectGroup ? "Modifier le groupe" : "Nouveau groupe"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <FormField name={"name"} render={({field}) => (
                                <div className="grid gap-2">
                                    <Label htmlFor="group-name">Nom du groupe</Label>
                                    <Input
                                        id="group-name"
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="ex: Groupe A"
                                        required
                                    />
                                </div>
                            )}/>
                            <FormField render={({field}) => (
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={field.value } onValueChange={field.onChange} required>
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder="Sélectionner un type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {listOfTypes.map((typeOption) => (
                                                <SelectItem key={typeOption} value={typeOption}>
                                                    {typeOption}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )} name={"type"}/>
                            <FormField name={"classe"} render={({field}) => (
                                <div className="grid gap-2">
                                    <Label htmlFor="classe">Classe</Label>
                                    <Input
                                        id="classe"
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="ex: Informatique"
                                        required
                                    />
                                </div>
                            )}/>
                            <FormField name={"size"} render={({field}) => (
                                <div className="grid gap-2">
                                    <Label htmlFor="size">Nombre d'étudiants</Label>
                                    <Input
                                        id="size"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        placeholder="ex: 30"
                                        min="1"
                                        required
                                    />
                                </div>
                            )}/>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Annuler
                            </Button>
                            <Button type="submit">{selectGroup ? "Enregistrer" : "Créer"}</Button>
                        </DialogFooter>
                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    )
}
