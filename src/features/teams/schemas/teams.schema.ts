import { z } from "zod";

export const teamsSchema = z.object({
    name: z.string().min(1, { message: "Team Name is required."}),

    description: z.string().nullable().optional()
});

export const teamsUpdateSchema = z.object({
    name: z.string().min(1, { message: "Team Name is required."}),

    description: z.string().nullable().optional()
});

export type TeamsSchema = z.infer<typeof teamsSchema>;
export type TeamsUpdateSchema = z.infer<typeof teamsUpdateSchema>;