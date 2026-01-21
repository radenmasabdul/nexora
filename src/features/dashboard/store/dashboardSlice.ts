import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardApi } from "../services/dashboard.api";
import type { DashboardResponse } from "../schemas/dashboard.types"

interface DashboardState extends DashboardResponse {
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: DashboardState = {
  taskStatus: [],
  taskPriorities: [],
  taskWorkload: [],
  projectsProgress: [],
  activity: {
    day: [],
    week: [],
    month: [],
    year: [],
  },
  taskByTeam: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchDashboard = createAsyncThunk< DashboardResponse, void, { rejectValue: string } >(
    "dashboard/fetchDashboard",
    async(_, thunkAPI) => {
        try {
            const [
                taskStatus,
                taskPriorities,
                taskWorkload,
                projectsProgress,
                activityDay,
                activityWeek,
                activityMonth,
                activityYear,
                taskByTeam
            ] = await Promise.all([
                dashboardApi.getTaskStatus(),
                dashboardApi.getTaskPriorities(),
                dashboardApi.getTaskWorkload(),
                dashboardApi.getProjectsProgress(),
                dashboardApi.getActivity("day"),
                dashboardApi.getActivity("week"),
                dashboardApi.getActivity("month"),
                dashboardApi.getActivity("year"),
                dashboardApi.getTaskByTeam()
            ]);

            return {
                taskStatus,
                taskPriorities,
                taskWorkload,
                projectsProgress,
                activity: {
                    day: activityDay,
                    week: activityWeek,
                    month: activityMonth,
                    year: activityYear,
                },
                taskByTeam
            };
        } catch (error: unknown) {
            let message = "Something went wrong";
            
            if (error instanceof Error) {
                message = error.message;
            }
            
            return thunkAPI.rejectWithValue(message);
        }
    }
)

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.taskStatus = action.payload.taskStatus;
                state.taskPriorities = action.payload.taskPriorities;
                state.taskWorkload = action.payload.taskWorkload;
                state.projectsProgress = action.payload.projectsProgress;
                state.activity = action.payload.activity;
                state.taskByTeam = action.payload.taskByTeam;
                state.lastUpdated = Date.now();
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export default dashboardSlice.reducer;