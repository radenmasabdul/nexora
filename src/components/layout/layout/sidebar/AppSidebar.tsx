import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldHalf,
  FolderKanban,
  ListTodo,
  Activity,
  Bell,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { useSidebar } from "./hooks/useSidebar";
import Logo from "@/assets/logo.png";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const dashboardItem: NavItem = {
  name: "Dashboard",
  icon: <LayoutDashboard size={20} />,
  path: "/dashboard"
};

const navSections: NavSection[] = [
  {
    title: "Management",
    items: [
      { name: "Users", icon: <Users size={20} />, path: "/users" },
      { name: "Teams", icon: <ShieldHalf size={20} />, path: "/teams" },
      { name: "Projects", icon: <FolderKanban size={20} />, path: "/projects" },
      { name: "Tasks", icon: <ListTodo size={20} />, path: "/tasks" },
    ]
  },
  {
    title: "Monitoring",
    items: [
      { name: "Activity Logs", icon: <Activity size={20} />, path: "/activity" },
      { name: "Notifications", icon: <Bell size={20} />, path: "/notifications" },
    ]
  }
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

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Management: true,
    Monitoring: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const active = location.pathname === item.path;
        return (
          <li key={item.name}>
            <Link
              to={item.path!}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                ${active
                  ? "bg-brand-primary/10 text-brand-primary dark:bg-white/10 dark:text-white"
                  : "hover:bg-surface-hover text-secondary dark:text-tertiary"
                }`}
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
        fixed top-0 left-0 z-50 h-screen border-r bg-surface
        transition-all duration-300
        ${isMobile ? (isMobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
        ${isMobile ? "w-72" : isExpanded || isHovered ? "w-72" : "w-20"}
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`flex items-center gap-3 px-4 py-4 ${isCollapsed ? "justify-center" : ""}`}>
        <img src={Logo} alt="Nexora Logo" className="w-9 h-9" />
        {!isCollapsed && (
          <span className="text-lg font-bold tracking-wide text-primary">Nexora</span>
        )}
      </span>

      <div className="p-4 flex flex-col gap-6">
        <div>
          {renderItems([dashboardItem])}
        </div>

        {navSections.map((section) => (
          <div key={section.title}>
            {isCollapsed ? (
              <div className="mb-3 flex justify-center">
                <MoreHorizontal size={16} className="text-tertiary " />
              </div>
            ) : (
              <button
                onClick={() => toggleSection(section.title)}
                className="mb-3 flex items-center justify-between w-full text-xs uppercase text-tertiary font-semibold tracking-wider hover:text-secondary transition-colors cursor-pointer"
              >
                <span>{section.title}</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${openSections[section.title] ? 'rotate-180' : ''}`} 
                />
              </button>
            )}
            {(isCollapsed || openSections[section.title]) && renderItems(section.items)}
          </div>
        ))}
      </div>
    </aside>
  );
}