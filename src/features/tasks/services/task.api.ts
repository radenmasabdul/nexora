import axios from "@/lib/axios";
import type { taskSchema, taskUpdateSchema } from "../schemas/task.schema";
import { z } from "zod";
import { createCacheKey, cachedRequest, clearCache } from "@/lib/requestCache";

type CreateTaskPayload = z.infer<typeof taskSchema>;
type UpdateTaskPayload = z.infer<typeof taskUpdateSchema>;

export const taskApi = {
    createTask: async (payload: CreateTaskPayload) => {
        const res = await axios.post("/tasks", payload);

        clearCache(createCacheKey("/tasks", { page: 1, limit: 10, search: "", status: "", priority: "" }));

        return res.data.data;
    },
    getAllTask: async (params: { page: number; limit: number; search?: string; status?: string; priority?: string }) => {
        const cacheKey = createCacheKey("/tasks", params);

        return cachedRequest(cacheKey, async () => {
            const res = await axios.get("/tasks", { params });
            return res.data;
        });
    },
    getTaskById: async (id: string) => {
        const cacheKey = createCacheKey(`/tasks/${id}`);

        return cachedRequest(cacheKey, async () => {
            const res = await axios.get(`/tasks/${id}`);
            return res.data.data;
        });
    },
    updateTask: async (id: string, payload: UpdateTaskPayload) => {
        const res = await axios.patch(`/tasks/${id}`, payload);

        clearCache(createCacheKey(`/tasks/${id}`));
        clearCache(createCacheKey("/tasks", { page: 1, limit: 10, search: "", status: "", priority: "" }));

        return res.data.data;
    },
    deleteTask: async (id: string) => {
        const rest = await axios.delete(`/tasks/${id}`);

        clearCache(createCacheKey(`/tasks/${id}`));
        clearCache(createCacheKey("/tasks", { page: 1, limit: 10, search: "", status: "", priority: "" }));

        return rest.data.data;
    }
};
