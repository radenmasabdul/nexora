import { configureStore } from "@reduxjs/toolkit"
import themeReducer from "@/app/theme/themeSlice"

export const store = configureStore({
    reducer: {
        theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

//typescript helpers
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch