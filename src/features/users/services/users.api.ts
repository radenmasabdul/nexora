import axios from "@/lib/axios"
import type { usersSchema } from "../schemas/users.schema"
import { z } from "zod"
import { createCacheKey, cachedRequest, clearCache } from "@/lib/requestCache"

type CreateUserPayload = z.infer<typeof usersSchema>

export const usersApi = {
    createUsers: async (payload : CreateUserPayload) => {
        const res = await axios.post("/users/create", payload);

        clearCache(createCacheKey("/users/all", { page: 1, limit: 10, search: "", role: "" }));
        clearCache(createCacheKey("/users/roles/counts"));

        return res.data.data;
    },
    getAllUsers: async (params: { page: number; limit: number; search?: string; role?: string }) => {
        const cacheKey = createCacheKey("/users/all", params);
    
        return cachedRequest(cacheKey, async () => {
            const res = await axios.get("/users/all", { params });
            return res.data;
        });
    },
    getUsersById: async (id: string) => {
        const cacheKey = createCacheKey(`/users/${id}`);
    
        return cachedRequest(cacheKey, async () => {
            const res = await axios.get(`/users/${id}`);
            return res.data.data;
        });
    },
    updateUsers: async (id: string, payload : FormData) => {
        const res = await axios.put(`/users/update/${id}`, payload, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        clearCache(createCacheKey(`/users/${id}`));
        clearCache(createCacheKey("/users/all", { page: 1, limit: 10, search: "", role: "" }));

        return res.data.data
    },
    deleteUsers: async (id: string) => {
        const res = await axios.delete(`/users/delete/${id}`);

        clearCache(createCacheKey(`/users/${id}`));
        clearCache(createCacheKey("/users/all", { page: 1, limit: 10, search: "", role: "" }));
        clearCache(createCacheKey("/users/roles/counts"));
        
        return res.data.data;
    },
    getRoleCounts: async () => {
        const cacheKey = createCacheKey("/users/roles/counts");
    
        return cachedRequest(cacheKey, async () => {
            const res = await axios.get("/users/roles/counts");
            return res.data.data;
        });
    }
}