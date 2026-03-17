import axios from "@/lib/axios";
import type { teamsSchema, teamsUpdateSchema } from "../schemas/teams.schema";
import { z } from "zod";
import { createCacheKey, cachedRequest, clearCache } from "@/lib/requestCache";

type CreateTeamPayload = z.infer<typeof teamsSchema>;
type UpdateTeamPayload = z.infer<typeof teamsUpdateSchema>;

export const teamsApi = {
    createTeam: async (payload: CreateTeamPayload) => {
        const res = await axios.post("/teams", payload);

        clearCache(createCacheKey("/teams", { page: 1, limit: 10, search: "" }));

        return res.data.data;
    },
    getAllTeams: async (params: { page: number; limit: number; search?: string }) => {
        const cacheKey = createCacheKey("/teams", params);
    
        return cachedRequest(cacheKey, async () => {
            const res = await axios.get("/teams", { params });
            return res.data;
        });
    },
    getTeamById: async (id: string) => {
        const cacheKey = createCacheKey(`/teams/${id}`);

        return cachedRequest(cacheKey, async () => {
            const res = await axios.get(`/teams/${id}`);
            return res.data.data;
        });
    },
    updateTeam: async (id: string, payload: UpdateTeamPayload) => {
        const res = await axios.patch(`/teams/${id}`, payload);

        clearCache(createCacheKey(`/teams/${id}`));
        clearCache(createCacheKey("/teams", { page: 1, limit: 10, search: "" }));

        return res.data.data;
    },
    deleteTeam: async (id: string) => {
        const res = await axios.delete(`/teams/${id}`);

        clearCache(createCacheKey(`/teams/${id}`));
        clearCache(createCacheKey("/teams", { page: 1, limit: 10, search: "" }));

        return res.data.data;
    }
};