export interface TaskStatus {
    status: "todo" | "in_progress" | "done";
    count: number;
}
export type TaskStatusResponse = TaskStatus[];

export interface TaskPriority {
    priority: "low" | "medium" | "high";
    count: number;
}
export type TaskPriorityResponse = TaskPriority[];

export interface TaskWorkload {
    user_id: string;
    name: string;
    workload: number;
}
export type TaskWorkloadResponse = TaskWorkload[];

export interface ProjectProgress {
    project_id: string;
    project_name: string;
    total_tasks: number;
    done_tasks: number;
    progress: number;
}
export type ProjectProgressResponse = ProjectProgress[];

export interface ActivityLog {
    period: string;
    total: number;
}
export type ActivityLogResponse = ActivityLog[];

export interface ActivityRange {
    day: ActivityLogResponse;
    week: ActivityLogResponse;
    month: ActivityLogResponse;
    year: ActivityLogResponse;
}

export interface TaskByTeam {
    team_id: string;
    team_name: string;
    task_count: number;
}
export type TaskByTeamResponse = TaskByTeam[];

export interface DashboardResponse {
  taskStatus: TaskStatusResponse;
  taskPriorities: TaskPriorityResponse;
  taskWorkload: TaskWorkloadResponse;
  projectsProgress: ProjectProgressResponse;
  activity: ActivityRange;
  taskByTeam: TaskByTeamResponse;
}