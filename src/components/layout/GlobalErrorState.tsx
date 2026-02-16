import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title?: string
  message?: string
  desc?: string
};

export default function GlobalErrorState({
  title = "Something went wrong",
  message = "Please try again later"
}: Props) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="border-none shadow-none ring-0 w-full max-w-xl bg-transparent">
        <CardContent className="p-6 text-center space-y-2">
          <AlertTriangle className="w-20 h-20 text-red-500 mx-auto" />
          <h1 className="text-lg font-semibold text-red-700">{title}</h1>
          <p className="text-sm text-red-600">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
};