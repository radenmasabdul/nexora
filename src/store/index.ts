import { configureStore } from "@reduxjs/toolkit"
import themeReducer from "@/app/theme/themeSlice"
import authReducer from "@/features/auth/store/authSlice"
import alertReducer from "@/app/state/alertSlice"

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        auth: authReducer,
        alert: alertReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch