import z from 'zod';

export const TeachingUnitSchema = z.object({
    id: z.number(),
    name: z.string(),
    abr: z.string(),
    associatedLevels: z.number().nullable()
});

export const TeachingUnitPostSchema = z.object({
    name: z.string().min(1, {message: "Le nom est requis"}),
    abr: z.string().min(1, {message: "L'abréviation est requise"}),
    associatedLevels: z.number().nullable()
})

export type TeachingUnit = z.infer<typeof TeachingUnitSchema>;
export type TeachingUnitPost = z.infer<typeof TeachingUnitPostSchema>;