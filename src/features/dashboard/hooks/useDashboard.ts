import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchDashboard } from "../store/dashboardSlice";

export const useDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { taskStatus, activity, taskByTeam, loading, lastUpdated } = useSelector((state: RootState) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboard());
    }, [dispatch]);

    const totalTasks = useMemo(() => taskStatus.reduce((sum, item) => sum + item.count, 0),[taskStatus]);
    const completedTasks = useMemo(() => taskStatus.find(item => item.status === "done")?.count || 0,[taskStatus]);

    const completionRate = useMemo(() => {
        if (totalTasks === 0) return "0";
        return ((completedTasks / totalTasks) * 100).toFixed(2);
    }, [totalTasks, completedTasks]);

    const totalWeekActivities = useMemo(() => activity.week.reduce((sum, item) => sum + item.total, 0),[activity.week]);
    const todayActivities = useMemo(() => activity.day.at(-1)?.total || 0,[activity.day]);
    const activeTeams = useMemo(() => taskByTeam.filter(team => team.task_count > 0),[taskByTeam]);

    const lastUpdateTime = lastUpdated ? new Date(lastUpdated).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "N/A";

    return {
        loading,
        lastUpdateTime,
        totalTasks,
        completedTasks,
        completionRate,
        totalWeekActivities,
        todayActivities,
        activeTeamsCount: activeTeams.length,
    };
}
