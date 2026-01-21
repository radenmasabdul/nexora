import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type SidebarState = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isMobile: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
};

const initialState: SidebarState = {
  isExpanded: true,
  isMobileOpen: false,
  isMobile: false,
  isHovered: false,
  activeItem: null,
  openSubmenu: null,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isExpanded = !state.isExpanded;
    },
    toggleMobileSidebar(state) {
      state.isMobileOpen = !state.isMobileOpen;
    },
    setIsMobile(state, action: PayloadAction<boolean>) {
      state.isMobile = action.payload;
      if (!action.payload) {
        state.isMobileOpen = false;
      }
    },
    setIsHovered(state, action: PayloadAction<boolean>) {
      state.isHovered = action.payload;
    },
    setActiveItem(state, action: PayloadAction<string | null>) {
      state.activeItem = action.payload;
    },
    setOpenSubmenu(state, action: PayloadAction<string | null>) {
      state.openSubmenu = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  toggleMobileSidebar,
  setIsMobile,
  setIsHovered,
  setActiveItem,
  setOpenSubmenu,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;