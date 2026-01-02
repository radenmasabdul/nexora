import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Menu, X, Search, MoreHorizontal } from "lucide-react";
import { useSidebar } from "./sidebar/hooks/useSidebar";
import DarkModeToggle from "@/app/theme/DarkModeToggle";

export default function Navbar() {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) toggleSidebar();
    else toggleMobileSidebar();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:border-b-0 lg:px-0 lg:py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggle}
              aria-label="Toggle Sidebar"
              className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg dark:border-gray-800 dark:text-gray-400"
            >
              {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <Link to="/" className="lg:hidden">
              <img className="dark:hidden" src="./images/logo/logo.svg" alt="Logo" />
              <img className="hidden dark:block" src="./images/logo/logo-dark.svg" alt="Logo" />
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search or type command..."
                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-11 pr-16 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 border px-2 py-1 rounded">
                ⌘ K
              </span>
            </div>
          </div>

          <button
            onClick={() => setApplicationMenuOpen(!isApplicationMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MoreHorizontal />
          </button>
        </div>

        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 shadow-theme-md lg:flex lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <div className="flex items-center gap-2 2xsm:gap-3">
            <DarkModeToggle />
            {/* NotificationDropdown */}
          </div>
          {/* UserDropdown */}
        </div>
      </div>
    </header>
  );
}
