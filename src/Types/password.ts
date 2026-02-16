import { z } from "zod";

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
        newPassword: z.string().min(6, "Le nouveau mot de passe doit faire au moins 6 caractères"),
        confirmPassword: z.string().min(1, "La confirmation est requise"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: "Le nouveau mot de passe doit être différent de l'actuel",
    })

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;