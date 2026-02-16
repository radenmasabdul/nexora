import axios from "@/lib/axios";
import type { teamsMemberSchema, teamsMemberUpdateSchema } from "../schemas/teamsMember.schema";
import { z } from "zod";
import { createCacheKey, cachedRequest, clearCache } from "@/lib/requestCache";

type CreateTeamMemberPayload = z.infer<typeof teamsMemberSchema>;
type UpdateTeamMemberPayload = z.infer<typeof teamsMemberUpdateSchema>;

export const teamsMemberApi = {
    createMember: async (payload: CreateTeamMemberPayload) => {
        const res = await axios.post("/members/create", payload);

        clearCache(createCacheKey("/members/all", { page: 1, limit: 10, search: "" }));

        return res.data.data;
    },
    getAllMembers: async (params: { page: number; limit: number; search?: string }) => {
        const cacheKey = createCacheKey("/members/all", params);

        return cachedRequest(cacheKey, async () => {
            const res = await axios.get("/members/all", { params });
            return res.data;
        });
    },
    getMemberById: async (id: string) => {
        const cacheKey = createCacheKey(`/members/${id}`);

        return cachedRequest(cacheKey, async () => {
            const res = await axios.get(`/members/${id}`);
            return res.data.data;
        });
    },
    updateMember: async (id: string, payload: UpdateTeamMemberPayload) => {
        const res = await axios.put(`/members/update/${id}`, payload);

        clearCache(createCacheKey(`/members/${id}`));
        clearCache(createCacheKey("/members/all", { page: 1, limit: 10, search: "" }));

        return res.data.data;
    },
    deleteMember: async (id: string) => {
        const res = await axios.delete(`/members/delete/${id}`);

        clearCache(createCacheKey(`/members/${id}`));
        clearCache(createCacheKey("/members/all", { page: 1, limit: 10, search: "" }));

        return res.data.data;
    },
    getMemberByTeamId: async (id: string) => {
        const cacheKey = createCacheKey(`/teams/${id}/members`);

        return cachedRequest(cacheKey, async () => {
            const res = await axios.get(`/teams/${id}/members`);
            return res.data.data;
        });
    }
};