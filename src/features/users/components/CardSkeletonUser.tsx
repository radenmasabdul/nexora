import { Card } from "@/components/ui/card";

export function CardSkeletonRoles() {
  return (
    <Card className="animate-pulse">
        <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg">
          <div className="w-10 h-10 rounded-md bg-surface" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="w-20 h-4 rounded-md bg-surface" />
          <div className="w-28 h-7 rounded-md bg-surface" />
        </div>
      </div>
    </Card>
  )
}

export function CardSkeletonTable() {
    return (
        <Card className="bg-background rounded-xl shadow-sm border border-default p-4 my-6 animate-pulse">
            <div className="flex flex-wrap gap-2 items-center mb-4">
                <div className="flex-1 min-w-70">
                    <div className="w-full h-10 rounded-md bg-surface" />
                </div>
                <div className="w-32 h-10 rounded-md bg-surface" />
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-2">
                <div className="h-6 rounded-md bg-surface" />
                <div className="h-6 rounded-md bg-surface" />
                <div className="h-6 rounded-md bg-surface" />
                <div className="h-6 rounded-md bg-surface" />
            </div>

            {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-4 items-center py-3">
                    <div className="h-5 rounded-md bg-surface" />
                    <div className="h-5 rounded-md bg-surface" />
                    <div className="h-5 rounded-md bg-surface" />
                    <div className="h-5 rounded-md bg-surface" />
                </div>
            ))}
            
            <div className="flex justify-between items-center mt-4">
                <div className="w-44 h-4 rounded-md bg-surface" />
                <div className="w-32 h-10 rounded-md bg-surface" />
            </div>
        </Card>
    )
}