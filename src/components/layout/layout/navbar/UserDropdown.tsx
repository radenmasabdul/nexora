import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { authApi } from "@/features/auth/services/auth.api";
import { setAlert } from "@/app/state/alertSlice";
import { clearAllCache } from "@/lib/requestCache"

type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function UserDropdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = (() => {
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return null;

      const parsed: AuthResponse = JSON.parse(raw);
      return parsed.user;
    } catch {
      return null;
    }
  })();

  const handleLogout = async () => {
    setLoading(true);

    dispatch(
      setAlert({
        message: "Logging out...",
        type: "info",
      })
    );

    try {
      await authApi.logout();

      clearAllCache();

      dispatch(
        setAlert({
          message: "Logout berhasil",
          type: "success",
        })
      );
    } catch {
      dispatch(
        setAlert({
          message: "Logout gagal, sesi dibersihkan",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 px-2
            text-primary hover:bg-transparent focus-visible:bg-transparent"
        >
          <span className="font-medium text-sm">
            {user?.name ?? "User"}
          </span>

          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={20}
        align="end"
        className="w-64 rounded-xl bg-surface border border-default"
      >
        <div className="px-2 py-1">
          <p className="text-sm font-medium text-primary">{user?.name ?? "User"}</p>
          <p className="text-xs text-tertiary">
            {user?.email ?? "user@example.com"}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="hover:bg-surface-hover">
          <Link to="#" className="text-primary">
            Edit profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="hover:bg-surface-hover">
          <Link to="#" className="text-primary">
            Account settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={loading}
          className="cursor-pointer hover:bg-surface-hover text-primary"
        >
          {loading ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
