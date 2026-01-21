import axios from "@/lib/axios";

const get = async (url: string) => {
  const res = await axios.get(url);
  return res.data.data;
};

export const dashboardApi = {
  getTaskStatus: () => get("/dashboard/tasks/status"),
  getTaskPriorities: () => get("/dashboard/tasks/priority"),
  getTaskWorkload: () => get("/dashboard/tasks/workload"),
  getProjectsProgress: () => get("/dashboard/projects/progress"),
  getActivity: (range: "day" | "week" | "month" | "year" = "day") => get(`/dashboard/activities/counts?range=${range}`),
  getTaskByTeam: () => get("/dashboard/teams/teams"),
};
