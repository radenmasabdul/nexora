import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CardOverviewSkeleton() {
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

export function CardChartSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-5 w-40 bg-surface rounded" />
        <div className="h-4 w-64 bg-surface rounded" />
      </CardHeader>

      <CardContent>
        <div className="h-75 w-full bg-surface rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function CardSkeletonTimeline() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-5 w-40 bg-surface rounded" />
        <div className="h-4 w-64 bg-surface rounded" />
      </CardHeader>

      <CardContent>
        <div className="flex justify-end gap-2 py-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-8 w-16 bg-surface rounded-lg" />
          ))}
        </div>
        <div className="h-72 w-full bg-surface rounded-lg" />
      </CardContent>
    </Card>
  )
}

export function CardSkeletonTask() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="space-y-2">
        <div className="h-5 w-40 bg-surface rounded" />
        <div className="h-4 w-64 bg-surface rounded" />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4">
              {/* team name skeleton */}
              <div className="w-48 h-4 bg-surface rounded" />

              {/* progress bar skeleton */}
              <div className="flex-1 bg-slate-200 rounded-full h-8 relative overflow-hidden">
                <div className="h-full bg-surface rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}