import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user : User | null;
    token: string | null;
    isAuthenticated: boolean;
    isHydrated: boolean
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isHydrated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (
            state,
            action: PayloadAction<{ user: User; token: string}>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isHydrated = true
        },
        hydrateAuth: (
            state,
            action: PayloadAction<{ user: User | null; token: string }>
        ) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
            state.isHydrated = true
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.isHydrated = true
        }
    }
})

export const { loginSuccess, hydrateAuth, logout } = authSlice.actions
export default authSlice.reducer