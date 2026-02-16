import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { teamsApi } from "../services/teams.api";
import { z } from "zod";
import { teamsSchema, teamsUpdateSchema } from "../schemas/teams.schema";
import { extractErrorMessage } from "@/lib/error.messages";

export interface Team {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
};

export type CreateTeamPayload = z.infer<typeof teamsSchema>;
export type UpdateTeamPayload = z.infer<typeof teamsUpdateSchema>;

interface TeamsState {
    teamList: Team[];
    selectedTeam: Team | null;
    
    currentPage: number;
    totalData: number;
    totalPages: number;

    loadingFetch: boolean;
    loadingDetail: boolean;
    loadingMutation: boolean;

    errorFetch: string | null;
    errorMutation: string | null;
};

const initialState: TeamsState = {
    teamList: [],
    selectedTeam: null,

    currentPage: 1,
    totalData: 0,
    totalPages: 0,

    loadingFetch: false,
    loadingDetail: false,
    loadingMutation: false,

    errorFetch: null,
    errorMutation: null,
};

export const fetchAllTeams = createAsyncThunk<
{
    data: Team[];
    currentPage: number;
    totalData: number;
    totalPages: number;
},
{ page: number; limit: number; search?: string },
{ rejectValue: string }
>(
    "teams/fetchAllTeams", async ({ page, limit, search }, { rejectWithValue }) => {
        try {
            return await teamsApi.getAllTeams({ page, limit, search });
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to fetch teams"));
        }
    },
    {
        condition: (_, { getState }) => {
            const { teams } = getState() as { teams: TeamsState };
            return !teams.loadingFetch;
        },
    }
);

export const fetchTeamById = createAsyncThunk<Team, string, { rejectValue: string }>(
    "teams/fetchTeamById", async (id, { rejectWithValue }) => {
        try {
            return await teamsApi.getTeamById(id);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to fetch team"));
        }
    },
    {
        condition: (_, { getState }) => {
            const { teams } = getState() as { teams: TeamsState };
            return !teams.loadingDetail;
        },
    }
);

export const createTeam = createAsyncThunk<Team, CreateTeamPayload, { rejectValue: string }>(
    "teams/createTeam", async (payload, { rejectWithValue }) => {
        try {
            return await teamsApi.createTeam(payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to create team"));
        }
    }
);

export const updateTeam = createAsyncThunk<Team, { id: string; payload: UpdateTeamPayload }, { rejectValue: string }>(
    "teams/updateTeam", async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await teamsApi.updateTeam(id, payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to update team"));
        }
    }
);

export const deleteTeam = createAsyncThunk<string, string, { rejectValue: string }>(
    "teams/deleteTeam", async (id, { rejectWithValue }) => {
        try {
            await teamsApi.deleteTeam(id);
            return id;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to delete team"));
        }
    }
);

const teamsSlice = createSlice({
    name: "teams",
    initialState,
    reducers: {
        clearSelectedTeam(state) {
            state.selectedTeam = null;
        },
        clearTeamsError(state) {
            state.errorFetch = null;
            state.errorMutation = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTeams.pending, (state) => {
                state.loadingFetch = true;
                state.errorFetch = null;
            })
            .addCase(fetchAllTeams.fulfilled, (state, action) => {
                state.loadingFetch = false;
                state.teamList = action.payload.data;
                state.currentPage = action.payload.currentPage;
                state.totalData = action.payload.totalData;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAllTeams.rejected, (state, action) => {
                state.loadingFetch = false;
                state.errorFetch = action.payload ?? null;
            });
        
        builder
            .addCase(fetchTeamById.pending, (state) => {
                state.loadingDetail = true;
                state.errorFetch = null;
            })
            .addCase(fetchTeamById.fulfilled, (state, action) => {
                state.loadingDetail = false;
                state.selectedTeam = action.payload;
            })
            .addCase(fetchTeamById.rejected, (state, action) => {
                state.loadingDetail = false;
                state.errorFetch = action.payload ?? null;
            })

        builder
            .addCase(createTeam.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(createTeam.fulfilled, (state) => {
                state.loadingMutation = false;
            })
            .addCase(createTeam.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            });

        builder
            .addCase(updateTeam.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(updateTeam.fulfilled, (state, action) => {
                state.loadingMutation = false;
                
                const index = state.teamList.findIndex(
                    (t) => t.id === action.payload.id
                );
                if (index !== -1) {
                    state.teamList[index] = action.payload;
                }

                if (state.selectedTeam?.id === action.payload.id) {
                    state.selectedTeam = action.payload;
                }
            })
            .addCase(updateTeam.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            });
        
        builder
            .addCase(deleteTeam.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(deleteTeam.fulfilled, (state, action) => {
                state.loadingMutation = false;
                state.teamList = state.teamList.filter(
                    (t) => t.id !== action.payload
                );
            })
            .addCase(deleteTeam.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            });
    },
});

export const { clearSelectedTeam, clearTeamsError } = teamsSlice.actions;
export default teamsSlice.reducer;