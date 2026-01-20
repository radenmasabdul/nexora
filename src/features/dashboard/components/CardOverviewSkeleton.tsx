import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CardOverviewSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-32 bg-surface rounded" />
        <div className="h-4 w-4 bg-surface rounded" />
      </CardHeader>

      <CardContent>
        <div className="h-8 w-20 bg-surface rounded mb-2" />
        <div className="h-3 w-24 bg-surface rounded" />
      </CardContent>
    </Card>
  )
}
