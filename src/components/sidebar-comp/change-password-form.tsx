"use client";

import { useState } from "react";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Loader2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { changeProfilePasswordService } from "@/services/profil";
import {ChangePasswordFormValues, changePasswordSchema} from "@/Types/password"; // Assure-toi que ce service existe


interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
    const { toast } = useToast();

    const defaultValues = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: defaultValues,
    });

    const onSubmit = async (data: ChangePasswordFormValues) => {
        try {
            await changeProfilePasswordService(data.currentPassword, data.newPassword);
            toast({ title: "Succès", description: "Mot de passe mis à jour." });
            handleClose();
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Erreur", description: "Vérifiez votre mot de passe actuel." });
        }
    };

    const handleClose = () => {
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier le mot de passe</DialogTitle>
                    <DialogDescription>Sécurisez votre compte avec un nouveau mot de passe.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Regarde comme c'est propre ici grâce au composant PasswordField plus bas */}
                        <PasswordField
                            control={form.control}
                            name="currentPassword"
                            label="Mot de passe actuel"
                            placeholder="Votre mot de passe actuel"
                        />

                        <PasswordField
                            control={form.control}
                            name="newPassword"
                            label="Nouveau mot de passe"
                            placeholder="Minimum 6 caractères"
                        />

                        <PasswordField
                            control={form.control}
                            name="confirmPassword"
                            label="Confirmation"
                            placeholder="Répétez le nouveau mot de passe"
                        />

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                <RotateCcw className="mr-2 h-4 w-4" /> Réinitialiser
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Check className="mr-2 h-4 w-4" />
                                )}
                                Enregistrer
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

interface PasswordFieldProps {
    control: Control<ChangePasswordFormValues>;
    name: keyof ChangePasswordFormValues;
    label: string;
    placeholder: string;
}

function PasswordField({ control, name, label, placeholder }: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={placeholder}
                                className="pr-10"
                                {...field}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}