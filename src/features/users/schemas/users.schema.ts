import { z } from "zod"

export const usersSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),

  role: z.enum(["admin", "manager", "member"], {
    message: "Invalid role"
  }),

  avatar_url: z.string().nullable().optional()
})
