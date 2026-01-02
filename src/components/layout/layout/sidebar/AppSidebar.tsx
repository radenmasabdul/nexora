import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users, 
  FolderKanban, 
  CheckSquare, 
  Activity,
  MoreHorizontal,
} from "lucide-react";
import { useSidebar } from "./hooks/useSidebar";
import Logo from "@/assets/logo.png";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
  { name: "Team", icon: <Users size={20} />, path: "/teams" },
  { name: "Projects", icon: <FolderKanban size={20} />, path: "/projects" },
  { name: "Tasks", icon: <CheckSquare size={20} />, path: "/tasks"},
  { name: "Activity", icon: <Activity size={20} />, path: "/activity"},
];

export default function AppSidebar() {
  const {
    isExpanded,
    isHovered,
    isMobile,
    isMobileOpen,
    setIsHovered,
  } = useSidebar();

  const location = useLocation();
  const isCollapsed = !isExpanded && !isHovered && !isMobileOpen;

  const renderItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-2">
      {items.map((item) => {
        const active = location.pathname === item.path;

        return (
          <li key={item.name}>
            <Link
              to={item.path!}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg
                ${active ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
              `}
            >
              {item.icon}
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-screen border-r bg-white dark:bg-gray-900
        transition-all duration-300
        ${isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
        ${isExpanded || isHovered ? "w-72" : "w-20"}
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to="/"
        className={`flex items-center gap-3 px-4 py-4 ${isCollapsed ? "justify-center" : ""}`}
      >
        <img src={Logo} alt="Nexora Logo" className="w-9 h-9" />
        {!isCollapsed && (
          <span className="text-lg font-bold tracking-wide">Nexora</span>
        )}
      </Link>

      <div className="p-4">
        <h2 className="mb-4 text-xs uppercase text-gray-400 flex items-center gap-2">
          {!isCollapsed ? "Menu" : <MoreHorizontal />}
        </h2>

        {renderItems(navItems)}
      </div>
    </aside>
  );
}
