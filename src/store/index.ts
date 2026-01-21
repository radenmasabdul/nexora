import { configureStore } from "@reduxjs/toolkit"
import themeReducer from "@/app/theme/themeSlice"
import authReducer from "@/features/auth/store/authSlice"
import alertReducer from "@/app/state/alertSlice"
import sidebarReducer from "@/components/layout/layout/sidebar/store/sidebarSlice"
import dashboardReducer from "@/features/dashboard/store/dashboardSlice"

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        alert: alertReducer,
        sidebar: sidebarReducer,
        dashboard: dashboardReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch