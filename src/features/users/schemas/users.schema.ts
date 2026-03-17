import { z } from "zod"

export const usersSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .refine(
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(value),
      {
        message:
          "Password must include uppercase, lowercase, number, and special character.",
      }
    ),

  role: z.enum(["administrator", "manager_division", "project_owner", "staff", ""], {
    message: "Invalid role"
  }).refine((val) => val !== "", {
    message: "Please select a role"
  }),

  avatar_url: z.string().nullable().optional()
})

export const usersUpdateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value === "") return true;
        return value.length >= 6;
      },
      { message: "Password must be at least 6 characters" }
    )
    .refine(
      (value) => {
        if (!value || value === "") return true;
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(value);
      },
      {
        message: "Password must include uppercase, lowercase, number, and special character.",
      }
    ),

  role: z
    .enum(["administrator", "manager_division", "project_owner", "staff", ""],
      { message: "Invalid role" })
    .refine((val) => val !== "",
      { message: "Please select a role"}
  ),
  
  avatar_url: z.any().optional()
});

export type UsersSchema = z.infer<typeof usersSchema>
export type UsersUpdateSchema = z.infer<typeof usersUpdateSchema>;