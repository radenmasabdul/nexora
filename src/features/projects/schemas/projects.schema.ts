import { z } from "zod";

export const projectsSchema = z.object({
    team_id: z
        .string()
        .min(1, { message: "Team ID is required" }),
    name: z
        .string()
        .min(1, { message: "Project name is required" }),
    description: z
        .string()
        .min(1, { message: "Description is required" }),
    deadline: z
        .string()
        .min(1, { message: "Deadline is required" }),
    status: z
        .enum(["planning", "in_progress", "on_hold", "completed", ""], {
            message: "Invalid status"
        }).refine((val) => val !== "", {
            message: "Please select a status"
        })
});

export const projectUpdateSchema = z.object({
    team_id: z
        .string()
        .min(1, { message: "Team ID is required" }),
    name: z
        .string()
        .min(1, { message: "Project name is required" }),
    description: z
        .string()
        .min(1, { message: "Description is required" }),
    deadline: z
        .string()
        .min(1, { message: "Deadline is required" }),
    status: z
        .enum(["planning", "in_progress", "on_hold", "completed", ""], {
            message: "Invalid status"
        }).refine((val) => val !== "", {
            message: "Please select a status"
        })
});

export type ProjectsSchema = z.infer<typeof projectsSchema>;
export type ProjectsUpdateSchema = z.infer<typeof projectUpdateSchema>;