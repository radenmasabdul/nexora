import axios from "@/lib/axios";
import type { projectsSchema, projectUpdateSchema } from "../schemas/projects.schema";
import { z } from "zod";
import { createCacheKey, cachedRequest, clearCache } from "@/lib/requestCache";

type CreateProjectPayload = z.infer<typeof projectsSchema>;
type UpdateProjectPayload = z.infer<typeof projectUpdateSchema>;

export const projectsApi = {
    createProjects: async (payload: CreateProjectPayload) => {
        const res = await axios.post("/projects/create", payload);

        clearCache(createCacheKey("/projects/all", { page: 1, limit: 10, search: "", status: "" }));

        return res.data.data;
    },
    getAllProjects: async (params: { page: number; limit: number; search?: string; status?: string }) => {
        const cacheKey = createCacheKey("/projects/all", params);
    
        return cachedRequest(cacheKey, async () => {
            const res = await axios.get("/projects/all", { params });
            return res.data;
        });
    },
    getProjectsById: async (id: string) => {
        const cacheKey = createCacheKey(`/projects/${id}`);

        return cachedRequest(cacheKey, async () => {
            const res = await axios.get(`/projects/${id}`);
            return res.data.data;
        });
    },
    updateProjects: async (id: string, payload: UpdateProjectPayload) => {
        const res = await axios.put(`/projects/update/${id}`, payload);

        clearCache(createCacheKey(`/projects/${id}`));
        clearCache(createCacheKey("/projects/all", { page: 1, limit: 10, search: "", status: "" }));

        return res.data.data;
    },
    deleteProjects: async (id: string) => {
        const res = await axios.delete(`/projects/delete/${id}`);

        clearCache(createCacheKey(`/projects/${id}`));
        clearCache(createCacheKey("/projects/all", { page: 1, limit: 10, search: "", status: "" }));
        
        return res.data.data;
    }
};