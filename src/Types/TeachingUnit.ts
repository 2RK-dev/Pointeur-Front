import z from 'zod';

export const TeachingUnitSchema = z.object({
    id: z.number(),
    name: z.string(),
    abr: z.string(),
    associatedLevels: z.number()
});

export type TeachingUnit = z.infer<typeof TeachingUnitSchema>;
