import { useEffect } from "react";
import { useSidebar } from "./hooks/useSidebar";

export function SidebarResizeHandler() {
  const { setIsMobile } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 1023px)").matches);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  return null;
}