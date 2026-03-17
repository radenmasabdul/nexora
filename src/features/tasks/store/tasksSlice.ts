import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskApi } from "../services/task.api";
import { z } from "zod";
import { taskSchema, taskUpdateSchema } from "../schemas/task.schema";
import { extractErrorMessage } from "@/lib/error.messages";

export interface Project {
    id: string;
    name: string;
}

export interface AssignUser {
    id: string;
    name: string;
    email: string;
}

export interface Task {
    id: string;
    project_id: string;
    assign_to: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "to_do" | "in_progress" | "review" | "done";
    due_date: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    project?: Project;
    assignedUser?: AssignUser;
}

export type CreateTaskPayload = z.infer<typeof taskSchema>;
export type UpdateTaskPayload = z.infer<typeof taskUpdateSchema>;

interface TaskState {
    taskList: Task[];
    selectedTask: Task | null;

    currentPage: number;
    totalData: number;
    totalPages: number;

    loadingFetch: boolean;
    loadingDetail: boolean;
    loadingMutation: boolean;

    errorFetch: string | null;
    errorMutation: string | null;
}

const initialState: TaskState = {
    taskList: [],
    selectedTask: null,

    currentPage: 1,
    totalData: 0,
    totalPages: 0,

    loadingFetch: false,
    loadingDetail: false,
    loadingMutation: false,

    errorFetch: null,
    errorMutation: null,
}

export const fetchAllTasks = createAsyncThunk<
{
    data: Task[];
    currentPage: number;
    totalData: number;
    totalPages: number;
},
{ page: number; limit: number; search?: string; status?: string; priority?: string },
{ rejectValue: string }
>(
    "tasks/fetchAllTasks", async ({ page, limit, search, status, priority }, { rejectWithValue }) => {
        try {
            return await taskApi.getAllTask({ page, limit, search, status, priority });
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to fetch tasks"));
        }
    },
    {
        condition: (_, { getState }) => {
            const { tasks } = getState() as { tasks: TaskState };
            return !tasks.loadingFetch;
        }
    }
);

export const fetchTaskById = createAsyncThunk<Task, string, { rejectValue: string }>(
    "tasks/fetchTaskById", async (id, { rejectWithValue }) => {
        try {
            return await taskApi.getTaskById(id);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to fetch tasks"));
        }
    },
    {
        condition: (_, { getState }) => {
            const { tasks } = getState() as { tasks: TaskState };
            return !tasks.loadingDetail;
        }
    }
);

export const createTask = createAsyncThunk<Task, CreateTaskPayload, { rejectValue: string }>(
    "tasks/createTask", async (payload, { rejectWithValue }) => {
        try {
            return await taskApi.createTask(payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to create tasks"));
        }
    }
);

export const updateTask = createAsyncThunk<Task, { id: string; payload: UpdateTaskPayload }, { rejectValue: string }>(
    "tasks/updateTask", async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await taskApi.updateTask(id, payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to update task"))
        }
    }
);

export const deleteTask = createAsyncThunk<string, string, { rejectValue: string }>(
    "tasks/deleteTask", async (id, { rejectWithValue }) => {
        try {
            await taskApi.deleteTask(id);
            return id;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to delete task"))
        }
    }
);

export const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        clearSelectedTask(state) {
            state.selectedTask = null;
        },
        clearTaskError(state) {
            state.errorFetch = null;
            state.errorMutation = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTasks.pending, (state) => {
                state.loadingFetch = true;
                state.errorFetch = null;
            })
            .addCase(fetchAllTasks.fulfilled, (state, action) => {
                state.loadingFetch = false;
                state.taskList = action.payload.data;
                state.currentPage = action.payload.currentPage;
                state.totalData = action.payload.totalData;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAllTasks.rejected, (state, action) => {
                state.loadingFetch = false;
                state.errorFetch = action.payload ?? null;
            })

        builder
            .addCase(fetchTaskById.pending, (state) => {
                state.loadingDetail = true;
                state.errorFetch = null;
            })
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.loadingDetail = false;
                state.selectedTask = action.payload;
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.loadingDetail = false;
                state.errorFetch = action.payload ?? null;
            })

        builder
            .addCase(createTask.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(createTask.fulfilled, (state) => {
                state.loadingMutation = false;
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            })

        builder
            .addCase(updateTask.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loadingMutation = false;

                const index = state.taskList.findIndex(
                    (t) => t.id === action.payload.id
                );
                if (index !== -1) {
                    state.taskList[index] = action.payload;
                };
                if (state.selectedTask?.id === action.payload.id) {
                    state.selectedTask = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            })

        builder
            .addCase(deleteTask.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loadingMutation = false;
                state.taskList = state.taskList.filter(
                    (t) => t.id !== action.payload
                );
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            })
    }
});

export const { clearSelectedTask, clearTaskError } = tasksSlice.actions;
export default tasksSlice.reducer;