import z from "zod";

export const CreateApiKeySchema = z.object({
    name: z.string(),
});

export const ApiKeyResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    prefix: z.string(),
    createdAt: z.string().datetime(),
});

export const ApiKeyResponseWithRawTokenSchema = ApiKeyResponseSchema.extend({
    rawToken: z.string(),
});
