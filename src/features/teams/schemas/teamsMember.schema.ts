import { z } from 'zod';

export const teamsMemberSchema = z.object({
    team_id: z.string().min(1, { message: "Team ID is required." }),

    user_id: z.string().min(1, { message: "Please select a team member." }),

    role: z.enum(["owner", "lead", "member", ""], {
        message: "Invalid role"
    }).refine((val) => val !== "", {
        message: "Please select a role"
    }),
});

export const teamsMemberUpdateSchema = z.object({
    team_id: z.string().min(1, { message: "Team ID is required." }),

    user_id: z.string().min(1, { message: "User ID is required." }),

    role: z.enum(["owner", "lead", "member", ""], {
        message: "Invalid role"
    }).refine((val) => val !== "", { 
        message: "Please select a role"
    }),
});

export type TeamsMemberSchema = z.infer<typeof teamsMemberSchema>;
export type TeamsMemberUpdateSchema = z.infer<typeof teamsMemberUpdateSchema>;