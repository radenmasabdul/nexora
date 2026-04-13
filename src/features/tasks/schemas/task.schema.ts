import { z } from "zod";

export const taskSchema = z.object({
    project_id: z
        .string()
        .min(1, { message: "Project Id is required" }),
    assign_to : z
        .string()
        .min(1, { message: "Assign to user is required" }),
    title : z
        .string()
        .min(1, { message: "Title is required" }),
    description: z
        .string()
        .min(1, { message: "Description is required" }),
    priority: z
        .enum(["low", "medium", "high", ""], {
            message: "Invalid priority"
        }).refine((val) => val !== "", {
            message: "Please select a priority"
        }),
    status: z
        .enum(["to_do", "in_progress", "review", "done", ""], {
            message: "Invalid status"
        }).refine((val) => val !== "", {
            message: "Please select a status"
        }),
    due_date: z
        .string()
        .min(1, { message: "Due date is required" })
});

export const taskUpdateSchema = z.object({
    project_id: z
        .string()
        .min(1, { message: "Project Id is required" }),
    assign_to : z
        .string()
        .min(1, { message: "Assign to user is required" }),
    title : z
        .string()
        .min(1, { message: "Title is required" }),
    description: z
        .string()
        .min(1, { message: "Description is required" }),
    priority: z
        .enum(["low", "medium", "high", ""], {
            message: "Invalid priority"
        }).refine((val) => val !== "", {
            message: "Please select a priority"
        }),
    status: z
        .enum(["to_do", "in_progress", "review", "done", ""], {
            message: "Invalid status"
        }).refine((val) => val !== "", {
            message: "Please select a status"
        }),
    due_date: z
        .string()
        .min(1, { message: "Due date is required" })
});

export type TaskSchema = z.infer<typeof taskSchema>;
export type TaskUpdateSchema = z.infer<typeof taskUpdateSchema>;