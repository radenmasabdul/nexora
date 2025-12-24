import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export type ThemeMode = "light" | "dark" | "system"

interface ThemeState {
  mode: ThemeMode
}

const initialState: ThemeState = {
  mode: "system",
}

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.mode === "light") state.mode = "dark"
      else if (state.mode === "dark") state.mode = "light"
      else state.mode = "dark"
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
