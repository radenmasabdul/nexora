import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const notifications = [
  {
    id: 1,
    name: "Terry Franci",
    project: "Nganter App",
    time: "5 min ago",
    avatar: "/images/user/user-02.jpg",
  },
  {
    id: 2,
    name: "Alena Franci",
    project: "Nganter App",
    time: "8 min ago",
    avatar: "/images/user/user-03.jpg",
  },
  {
    id: 3,
    name: "Jocelyn Kenter",
    project: "Nganter App",
    time: "15 min ago",
    avatar: "/images/user/user-04.jpg",
  },
];

export default function NotificationDropdown() {
  const [notifying, setNotifying] = useState(true);

  return (
    <DropdownMenu onOpenChange={() => setNotifying(false)}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-full
            border border-gray-200 bg-white text-gray-500
            hover:bg-gray-100 hover:text-gray-700
            dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 cursor-pointer"
        >
          {notifying && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-400">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
            </span>
          )}
          <Bell size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-87.5 rounded-xl p-3"
      >
        <div className="mb-3 border-b pb-2">
          <h5 className="text-sm font-semibold">Notification</h5>
        </div>

        <div className="max-h-90 space-y-1 overflow-y-auto">
          {notifications.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className="flex gap-3 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <img
                src={item.avatar}
                alt={item.name}
                className="h-10 w-10 rounded-full"
              />

              <div className="flex flex-col text-sm">
                <span className="text-gray-700 dark:text-gray-200">
                  <strong>{item.name}</strong> requests permission to change{" "}
                  <strong>{item.project}</strong>
                </span>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        <Link
          to="#"
          className="mt-3 block rounded-lg border px-4 py-2 text-center text-sm font-medium
            hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          View All Notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
