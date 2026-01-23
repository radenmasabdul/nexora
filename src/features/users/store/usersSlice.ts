import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { usersApi } from "../services/users.api";
import { z } from "zod";
import { usersSchema } from "../schemas/users.schema";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "member";
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateUserPayload = z.infer<typeof usersSchema>;
export type UpdateUserPayload = Partial<CreateUserPayload>;

interface UsersState {
  userList: User[];
  selectedUser: User | null;

  currentPage: number;
  totalData: number;
  totalPages: number;

  loadingFetch: boolean;
  loadingMutation: boolean;

  errorFetch: string | null;
  errorMutation: string | null;

  roleCounts: {
    admin: number;
    manager: number;
    member: number;
  };
}

const initialState: UsersState = {
  userList: [],
  selectedUser: null,

  currentPage: 1,
  totalData: 0,
  totalPages: 0,

  loadingFetch: false,
  loadingMutation: false,

  errorFetch: null,
  errorMutation: null,

  roleCounts: {
    admin: 0,
    manager: 0,
    member: 0,
  }
};

export const fetchAllUsers = createAsyncThunk<
{
  data: User[];
  currentPage: number;
  totalData: number;
  totalPages: number;
},
{ page: number; limit: number; search?: string; role?: string },
{ rejectValue: string }
>(
  "users/fetchAllUsers", async ({ page, limit, search, role  }, { rejectWithValue }) => {
    try {
      return await usersApi.getAllUsers({ page, limit, search, role });
    } catch {
      return rejectWithValue("Failed to fetch users");
    }
  }
);

export const fetchUserById = createAsyncThunk<User, string, { rejectValue: string }>(
    "users/fetchUserById", async (id, { rejectWithValue }) => {
        try {
            return await usersApi.getUsersById(id);
        } catch {
            return rejectWithValue("Failed to fetch user");
        }
    }
);

export const createUser = createAsyncThunk<User, CreateUserPayload, { rejectValue: string }>(
    "users/createUser", async (payload, { rejectWithValue }) => {
        try {
            return await usersApi.createUsers(payload);
        } catch {
            return rejectWithValue("Failed to create user");
        }
    }
);

export const updateUser = createAsyncThunk<User, { id: string; payload: UpdateUserPayload },{ rejectValue: string }>(
    "users/updateUser", async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await usersApi.updateUsers(id, payload);
        } catch {
            return rejectWithValue("Failed to update user");
        }
    }
);

export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
    "users/deleteUser", async (id, { rejectWithValue }) => {
        try {
            await usersApi.deleteUsers(id);
            return id;
        } catch {
            return rejectWithValue("Failed to delete user");
        }
    }
);

export const fetchRoleCounts = createAsyncThunk<
  { admin: number; manager: number; member: number },
  void,
  { rejectValue: string }
>(
  "users/fetchRoleCounts",
  async (_, { rejectWithValue }) => {
    try {
      return await usersApi.getRoleCounts();
    } catch {
      return rejectWithValue("Failed to fetch role counts");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
    clearUsersError(state) {
      state.errorFetch = null;
      state.errorMutation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loadingFetch = true;
        state.errorFetch = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loadingFetch = false;
        state.userList = action.payload.data;
        state.currentPage = action.payload.currentPage;
        state.totalData = action.payload.totalData;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loadingFetch = false;
        state.errorFetch = action.payload ?? null;
      });

    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loadingFetch = true;
        state.errorFetch = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loadingFetch = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loadingFetch = false;
        state.errorFetch = action.payload ?? null;
      });

    builder
      .addCase(createUser.pending, (state) => {
        state.loadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loadingMutation = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loadingMutation = false;
        state.errorMutation = action.payload ?? null;
      });

    builder
      .addCase(updateUser.pending, (state) => {
        state.loadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loadingMutation = false;

        const index = state.userList.findIndex(
          (u) => u.id === action.payload.id
        );
        if (index !== -1) {
          state.userList[index] = action.payload;
        }

        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loadingMutation = false;
        state.errorMutation = action.payload ?? null;
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        state.loadingMutation = true;
        state.errorMutation = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loadingMutation = false;
        state.userList = state.userList.filter(
          (u) => u.id !== action.payload
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loadingMutation = false;
        state.errorMutation = action.payload ?? null;
      });

    builder
      .addCase(fetchRoleCounts.pending, (state) => {
        state.loadingFetch = true;
        state.errorFetch = null;
      })
      .addCase(fetchRoleCounts.fulfilled, (state, action) => {
        state.loadingFetch = false;
        state.roleCounts = action.payload;
      })
      .addCase(fetchRoleCounts.rejected, (state, action) => {
        state.loadingFetch = false;
        state.errorFetch = action.payload ?? null;
      });
  },
});

export const { clearSelectedUser, clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;