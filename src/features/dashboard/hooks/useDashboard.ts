import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { fetchDashboard } from "../store/dashboardSlice";

export const useDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { taskStatus, taskPriorities, taskWorkload, projectsProgress, activity, taskByTeam, loading, lastUpdated } = useSelector((state: RootState) => state.dashboard);

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
    const [activityRange, setActivityRange] = useState<'day' | 'week' | 'month' | 'year'>('day');

    const formattedTaskStatus = useMemo(() => {
        return taskStatus.map(item => ({
            ...item,
            status:
            item.status === "done"
            ? "Done"
            : item.status === "todo"
            ? "To Do"
            : item.status === "in_progress"
            ? "In Progress"
            : item.status,
        }));
    }, [taskStatus]);

    const formattedTaskPriorities = useMemo(() => {
        return taskPriorities.map(item => ({
            ...item,
            priority:
            item.priority === "low"
            ? "Low"
            : item.priority === "medium"
            ? "Medium"
            : item.priority === "high"
            ? "High"
            : item.priority,
        }));
    }, [taskPriorities]);

    const topTaskWorkload = useMemo(() => {
        return [...taskWorkload]
            .sort((a, b) => b.workload - a.workload)
            .slice(0, 10);
    }, [taskWorkload]);

    const workloadColors = useMemo(() => {
        return topTaskWorkload.map(item => {
            if (item.workload > 5) return "#EF4444";
            if (item.workload >= 3) return "#F59E0B";
            return "#10B981";
        });
    }, [topTaskWorkload]);

    const topProjectProgress = useMemo(() => {
        return [...projectsProgress]
            .sort((a, b) => b.progress - a.progress)
            .slice(0, 10);
    }, [projectsProgress])

    const projectProgressColors = useMemo(() => {
        return topProjectProgress.map(item => {
            if (item.progress === 100) return "#10B981";
            if (item.progress >= 70) return "#3B82F6";
            if (item.progress >= 40) return "#F59E0B";
            return "#EF4444";
        });
    }, [topProjectProgress])

    const activityData = useMemo(() => {
        return activity[activityRange];
    }, [activity, activityRange]);

    const topTeamsByTasks = useMemo(() => {
        return [...taskByTeam]
            .filter(team => team.task_count > 0)
            .sort((a, b) => b.task_count - a.task_count)
            .slice(0, 10);
        }, [taskByTeam]);

    return {
        loading,
        lastUpdateTime,
        taskStatus,
        formattedTaskStatus,
        taskPriorities,
        formattedTaskPriorities,
        taskWorkload,
        projectsProgress,
        topProjectProgress,
        topTaskWorkload,
        workloadColors,
        projectProgressColors,
        totalTasks,
        completedTasks,
        completionRate,
        totalWeekActivities,
        todayActivities,
        activityRange,
        setActivityRange,
        activityData,
        activeTeamsCount: activeTeams.length,
        topTeamsByTasks
    };
}
