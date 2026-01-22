import axios from "@/lib/axios"
import type { usersSchema } from "../schemas/users.schema"
import { z } from "zod"

type CreateUserPayload = z.infer<typeof usersSchema>
type UpdateUserPayload = Partial<CreateUserPayload>

export const usersApi = {
    createUsers: async (payload : CreateUserPayload) => {
        const res = await axios.post("/users/create", payload)
        return res.data.data
    },
    getAllUsers: async () => {
        const res = await axios.get("/users/all")
        return res.data.data
    },
    getUsersById: async (id: string) => {
        const res = await axios.get(`/users/${id}`)
        return res.data.data
    },
    updateUsers: async (id: string, payload : UpdateUserPayload) => {
        const res = await axios.put(`/users/update/${id}`, payload)
        return res.data.data
    },
    deleteUsers: async (id: string) => {
        const res = await axios.delete(`/users/delete/${id}`)
        return res.data.data
    }
}