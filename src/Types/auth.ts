import z from "zod";

export const CredentialsSchema = z.object({
    username: z.string()
        .min(1, "Le nom d'utilisateur est requis.")
        .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères.")
        .regex(/^[a-zA-Z0-9_\-]{1,50}$/, "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres, des underscores et des tirets."),
    password: z.string()
        .nonempty("Le mot de passe est requis."),
});

export const UserSchema = z.object({
    username: z.string(),
    role: z.string(),
});

export type Credentials = z.infer<typeof CredentialsSchema>;
export type User = z.infer<typeof UserSchema>;