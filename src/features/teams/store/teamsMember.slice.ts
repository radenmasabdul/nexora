import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { teamsMemberApi } from "../services/teamsMember.api";
import { z } from "zod";
import { teamsMemberSchema, teamsMemberUpdateSchema } from "../schemas/teamsMember.schema";
import { extractErrorMessage } from "@/lib/error.messages";

export interface TeamMember {
    id: string;
    team_id: string;
    user_id: string;
    role: string;
    joined_at: string;
};

export type CreateTeamMemberPayload = z.infer<typeof teamsMemberSchema>;
export type UpdateTeamMemberPayload = z.infer<typeof teamsMemberUpdateSchema>;

interface TeamMembersState {
    memberList: TeamMember[];
    selectedMember: TeamMember | null;
    
    currentPage: number;
    totalData: number;
    totalPages: number;

    loadingFetch: boolean;
    loadingDetail: boolean;
    loadingMutation: boolean;

    errorFetch: string | null;
    errorMutation: string | null;
};

const initialState: TeamMembersState = {
    memberList: [],
    selectedMember: null,

    currentPage: 1,
    totalData: 0,
    totalPages: 0,

    loadingFetch: false,
    loadingDetail: false,
    loadingMutation: false,

    errorFetch: null,
    errorMutation: null,
};

export const fetchAllTeamMembers = createAsyncThunk<
{
    data: TeamMember[];
    currentPage: number;
    totalData: number;
    totalPages: number;
},
{ page: number; limit: number; search?: string },
{ rejectValue: string }
>(
    "teamMembers/fetchAllTeamMembers", async ({ page, limit, search }, { rejectWithValue }) => {
        try {
            return await teamsMemberApi.getAllMembers({ page, limit, search });
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to fetch teams members"));
        }
    },
    {
        condition: (_, { getState }) => {
            const { teamMembers } = getState() as { teamMembers: TeamMembersState };
            return !teamMembers.loadingFetch;
        },
    }
);

export const fetchTeamMemberById = createAsyncThunk<TeamMember, string, { rejectValue: string }>(
    "teamMembers/fetchTeamMemberById", async (id, { rejectWithValue }) => {
        try {
            return await teamsMemberApi.getMemberById(id);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to fetch teams member details"));
        }
    },
    {
        condition: (_, { getState }) => {
            const { teamMembers } = getState() as { teamMembers: TeamMembersState };
            return !teamMembers.loadingDetail;
        },
    }
);

export const createTeamMember = createAsyncThunk<TeamMember, CreateTeamMemberPayload, { rejectValue: string }>(
    "teamMembers/createTeamMember", async (payload, { rejectWithValue }) => {
        try {
            return await teamsMemberApi.createMember(payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to create team member"));
        }
    }
);

export const updateTeamMember = createAsyncThunk<TeamMember, { id: string; payload: UpdateTeamMemberPayload }, { rejectValue: string }>(
    "teamMembers/updateTeamMember", async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await teamsMemberApi.updateMember(id, payload);
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to update team member"));
        }
    }
);

export const deleteTeamMember = createAsyncThunk<string, string, { rejectValue: string }>(
    "teamMembers/deleteTeamMember", async (id, { rejectWithValue }) => {
        try {
            await teamsMemberApi.deleteMember(id);
            return id;
        } catch (err) {
            return rejectWithValue(extractErrorMessage(err, "Failed to delete team member"));
        }
    }
);

const teamsMemberSlice = createSlice({
    name: "teamMembers",
    initialState,
    reducers: {
        clearSelectedTeamMember(state) {
            state.selectedMember = null;
        },
        clearTeamMembersError(state) {
            state.errorFetch = null;
            state.errorMutation = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTeamMembers.pending, (state) => {
                state.loadingFetch = true;
                state.errorFetch = null;
            })
            .addCase(fetchAllTeamMembers.fulfilled, (state, action) => {
                state.loadingFetch = false;
                state.memberList = action.payload.data;
                state.currentPage = action.payload.currentPage;
                state.totalData = action.payload.totalData;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAllTeamMembers.rejected, (state, action) => {
                state.loadingFetch = false;
                state.errorFetch = action.payload ?? null;
            })
        
        builder
            .addCase(fetchTeamMemberById.pending, (state) => {
                state.loadingDetail = true;
                state.errorFetch = null;
            })
            .addCase(fetchTeamMemberById.fulfilled, (state, action) => {
                state.loadingDetail = false;
                state.selectedMember = action.payload;
            })
            .addCase(fetchTeamMemberById.rejected, (state, action) => {
                state.loadingDetail = false;
                state.errorFetch = action.payload ?? null;
            })

        builder
            .addCase(createTeamMember.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(createTeamMember.fulfilled, (state) => {
                state.loadingMutation = false;
            })
            .addCase(createTeamMember.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            })

        builder
            .addCase(updateTeamMember.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(updateTeamMember.fulfilled, (state, action) => {
                state.loadingMutation = false;

                const index = state.memberList.findIndex(
                    (m) => m.id === action.payload.id
                );
                if (index !== -1) {
                    state.memberList[index] = action.payload;
                }

                if (state.selectedMember?.id === action.payload.id) {
                    state.selectedMember = action.payload;
                }
            })
            .addCase(updateTeamMember.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            })

        builder
            .addCase(deleteTeamMember.pending, (state) => {
                state.loadingMutation = true;
                state.errorMutation = null;
            })
            .addCase(deleteTeamMember.fulfilled, (state, action) => {
                state.loadingMutation = false;
                state.memberList = state.memberList.filter(
                    (m) => m.id !== action.payload
                );
            })
            .addCase(deleteTeamMember.rejected, (state, action) => {
                state.loadingMutation = false;
                state.errorMutation = action.payload ?? null;
            });
    },
});

export const { clearSelectedTeamMember, clearTeamMembersError } = teamsMemberSlice.actions;
export default teamsMemberSlice.reducer;