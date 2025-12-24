import axios from "@/lib/axios"
import { tokenService } from "./token.service"
import type { LoginSchema } from "../schemas/login.schema"

export const authApi = {
    login: async (payload: LoginSchema) => {
        const res = await axios.post("/auth/login", payload)
        
        const token = res.data.data.token
        const user = res.data.data.user

        tokenService.set(token)
        localStorage.setItem('auth', JSON.stringify({ token, user }))
        
        return {
            user: res.data.data.user,
            token
        }
    }
}