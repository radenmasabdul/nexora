import axios from "@/lib/axios";
import { createCacheKey, cachedRequest } from "@/lib/requestCache";

export const dashboardApi = {
  getTaskStatus: async () => {
    const cacheKey = createCacheKey("/dashboard/tasks/status");
    
    return cachedRequest(cacheKey, async () => {
      const res = await axios.get("/dashboard/tasks/status");
      return res.data.data;
    });
  },
  getTaskPriorities: async () => {
    const cacheKey = createCacheKey("/dashboard/tasks/priority");
    
    return cachedRequest(cacheKey, async () => {
      const res = await axios.get("/dashboard/tasks/priority");
      return res.data.data;
    });
  },
  getTaskWorkload: async () => {
    const cacheKey = createCacheKey("/dashboard/tasks/workload");
    
    return cachedRequest(cacheKey, async () => {
      const res = await axios.get("/dashboard/tasks/workload");
      return res.data.data;
    });
  },
  getProjectsProgress: async () => {
    const cacheKey = createCacheKey("/dashboard/projects/progress");
    
    return cachedRequest(cacheKey, async () => {
      const res = await axios.get("/dashboard/projects/progress");
      return res.data.data;
    });
  },
  getActivity: async (range: "day" | "week" | "month" | "year" = "day") => {
    const cacheKey = createCacheKey("/dashboard/activities/counts", { range });
    
    return cachedRequest(cacheKey, async () => {
      const res = await axios.get(`/dashboard/activities/counts?range=${range}`);
      return res.data.data;
    });
  },
  getTaskByTeam: async () => {
    const cacheKey = createCacheKey("/dashboard/teams/teams");
    
    return cachedRequest(cacheKey, async () => {
      const res = await axios.get("/dashboard/teams/teams");
      return res.data.data;
    });
  },
};
