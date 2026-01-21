import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import {
  toggleSidebar,
  toggleMobileSidebar,
  setIsHovered,
  setActiveItem,
  setOpenSubmenu,
  setIsMobile,
} from "@/components/layout/layout/sidebar/store/sidebarSlice";

export const useSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sidebar = useSelector((state: RootState) => state.sidebar);

  return {
    ...sidebar,
    isExpanded: sidebar.isMobile ? false : sidebar.isExpanded,
    toggleSidebar: () => dispatch(toggleSidebar()),
    toggleMobileSidebar: () => dispatch(toggleMobileSidebar()),
    setIsHovered: (value: boolean) => dispatch(setIsHovered(value)),
    setActiveItem: (value: string | null) =>
      dispatch(setActiveItem(value)),
    setOpenSubmenu: (value: string | null) =>
      dispatch(setOpenSubmenu(value)),
    setIsMobile: (value: boolean) =>
      dispatch(setIsMobile(value)),
  };
};
