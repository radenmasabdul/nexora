import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectsApi } from "../services/projects.api"
import { z } from "zod";
import { projectsSchema, projectUpdateSchema } from "../schemas/projects.schema";
import { extractErrorMessage } from "@/lib/error.messages";

export interface ProjectTeams {
    id: string;
    name: string;
    description: string;
}

export interface Project {
    id: string;
    team_id: string;
    name: string;
    description: string;
    status: "active" | "on_hold" | "completed";
    deadline: string;
    created_at: string;
    updated_at: string;
    team?: ProjectTeams;
}

export type CreateProjectPayload = z.infer<typeof projectsSchema>;
export type UpdateProjectPayload = z.infer<typeof projectUpdateSchema>;

interface ProjectState {
    projectList: Project[];
    selectedProject: Project | null;

    currentPage: number;
    totalData: number;
    totalPages: number;

    loadingFetch: boolean;
    loadingDetail: boolean;
    loadingMutation: boolean;

    errorFetch: string | null;
    errorMutation: string | null;
}

const initialState: ProjectState = {
    projectList: [],
    selectedProject: null,

    currentPage: 1,
    totalData: 0,
    totalPages: 0,

    loadingFetch: false,
    loadingDetail: false,
    loadingMutation: false,

    errorFetch: null,
    errorMutation: null,
}

export const fetchAllProjects = createAsyncThunk<
{
    data: Project[];
    currentPage: number;
    totalData: number;
    totalPages: number;
},
{ page: number; limit: number; search?: string; status?: string },
{ rejectValue: string }
>(
    "projects/fetchAllProjects", async ({ page, limit, search, status }, { rejectWithValue }) => {
        try {
            return await projectsApi.getAllProjects({ page, limit, search, status });
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to fetch projects"));
        }
    },
    {
        condition: (_, { getState }) => {
            const { projects } = getState() as { projects: ProjectState };
            return !projects.loadingFetch;
        },
    }
);

export const fetchProjectById = createAsyncThunk<Project, string, { rejectValue: string }>(
    "projects/fetchProjectById", async (id, { rejectWithValue }) => {
        try {
            return await projectsApi.getProjectsById(id);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to fetch project"));
        }
    },
    {
        condition: (_, { getState }) => {
            const { projects } = getState() as { projects: ProjectState };
            return !projects.loadingDetail;
        },
    } 
);

export const createProject = createAsyncThunk<Project, CreateProjectPayload, { rejectValue: string }>(
    "projects/createProject", async (payload, { rejectWithValue }) => {
        try {
            return await projectsApi.createProjects(payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to create project"));
        }
    }
);

export const updateProject = createAsyncThunk<Project, { id: string; payload: UpdateProjectPayload }, { rejectValue: string }>(
    "projects/updateProject", async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await projectsApi.updateProjects(id, payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to update project"));
        }
    }
);

export const deleteProject = createAsyncThunk<string, string, { rejectValue: string }>(
    "projects/deleteProject", async (id, { rejectWithValue }) => {
        try {
            await projectsApi.deleteProjects(id);
            return id;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to delete project"));
        }
    }
);

export const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        clearSelectedProject(state) {
            state.selectedProject = null;
        },
        clearProjectsError(state) {
            state.errorFetch = null;
            state.errorMutation = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProjects.pending, (state) => {
                state.loadingFetch = true;
                state.errorFetch = null;
            })
            .addCase(fetchAllProjects.fulfilled, (state, action) => {
                state.loadingFetch = false;
                state.projectList = action.payload.data;
                state.currentPage = action.payload.currentPage;
                state.totalData = action.payload.totalData;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAllProjects.rejected, (state, action) => {
                state.loadingFetch = false;
                state.errorFetch = action.payload ?? null;
            })

        builder
            .addCase(fetchProjectById.pending, (state) => {
                state.loadingDetail = true;
                state.errorFetch = null;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.loadingDetail = false;
                state.selectedProject = action.payload;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                state.loadingDetail = false;
                state.errorFetch = action.payload ?? null;
            })

        builder
            .addCase(createProject.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(createProject.fulfilled, (state) => {
                state.loadingMutation = false;
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            })

        builder
            .addCase(updateProject.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loadingMutation = false;

                const index = state.projectList.findIndex(
                    (p) => p.id === action.payload.id
                );
                if (index !== -1) {
                    state.projectList[index] = action.payload;
                }

                if (state.selectedProject?.id === action.payload.id) {
                    state.selectedProject = action.payload;
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            })

        builder
            .addCase(deleteProject.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.loadingMutation = false;
                state.projectList = state.projectList.filter(
                    (p) => p.id !== action.payload
                );
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            })
    }
});

export const { clearSelectedProject, clearProjectsError } = projectsSlice.actions;
export default projectsSlice.reducer;