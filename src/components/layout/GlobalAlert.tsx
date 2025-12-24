import { useEffect, type JSX } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "@/store";
import { clearAlert } from "@/app/state/alertSlice";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, AlertCircleIcon, InfoIcon } from "lucide-react";

export default function GlobalAlert() {
  const dispatch = useDispatch<AppDispatch>();
  const { message, type } = useSelector((state: RootState) => state.alert);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearAlert());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;
  
  const alertMap: Record<
    "success" | "info" | "error",
    { bg: string; text: string; icon: JSX.Element }
    > = {
      success: {
        bg: "bg-green-50",
        text: "text-green-800",
        icon: <CheckCircle2Icon className="text-green-500 w-5 h-5 mr-2" />,
      },
      info: {
        bg: "bg-blue-50",
        text: "text-blue-800",
        icon: <InfoIcon className="text-blue-500 w-5 h-5 mr-2" />,
      },
      error: {
        bg: "bg-red-50",
        text: "text-red-800",
      icon: <AlertCircleIcon className="text-red-500 w-5 h-5 mr-2" />,
    },
  };

  const { bg, text, icon } = alertMap[type || "info"];

  return (

  <div className="fixed top-4 right-4 z-50 w-[320px]">
    <Alert className={`${bg} ${text} flex items-center`}>
      {icon}
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  </div>
  );
}
