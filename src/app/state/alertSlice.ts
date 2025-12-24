import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AlertType = "success" | "error" | "info";

interface AlertState {
  message: string | null;
  type: AlertType | null;
}

const initialState: AlertState = {
  message: null,
  type: null,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<{ message: string; type: AlertType }>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearAlert: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { setAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
