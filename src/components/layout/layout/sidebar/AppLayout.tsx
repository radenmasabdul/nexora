import { Outlet } from "react-router"
import { SidebarResizeHandler } from "./SidebarResizeHandler"
import { useSidebar } from "./hooks/useSidebar"
import Navbar from "../Navbar"
import Backdrop from "./Backdrop"
import AppSidebar from "./AppSidebar"

export default function AppLayout() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()

  return (
    <>
      <SidebarResizeHandler />

      <div className="min-h-screen flex bg-gray-50">
        <AppSidebar />
        <Backdrop />

        <div
          className={`
            flex-1 transition-all duration-300
            ${isExpanded || isHovered ? "lg:ml-72" : "lg:ml-20"}
            ${isMobileOpen ? "ml-0" : ""}
          `}
        >
          <Navbar />

          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}