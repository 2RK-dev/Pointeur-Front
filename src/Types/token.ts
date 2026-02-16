// @/schemas/token.ts
import { z } from "zod";

export const createTokenSchema = z.object({
    name: z.string()
        .min(3, "Le nom doit faire au moins 3 caractères")
        .max(50, "Le nom est trop long"),
});

export type CreateTokenFormValues = z.infer<typeof createTokenSchema>;

export const ApiTokenSchema = z.object({
    id: z.string(),
    name: z.string(),
    prefix: z.string(),
    createdAt: z.date(),
});

export const ApiTokenResponseSchema = ApiTokenSchema.extend({
    token: z.string(),
})

export type ApiToken = z.infer<typeof ApiTokenSchema>;
export type ApiTokenResponse = z.infer<typeof ApiTokenResponseSchema>;