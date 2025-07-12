import z from 'zod';

export const TeachingUnitSchema = z.object({
    id: z.number(),
    name: z.string(),
    abr: z.string()
});

export type TeachingUnit = z.infer<typeof TeachingUnitSchema>;
