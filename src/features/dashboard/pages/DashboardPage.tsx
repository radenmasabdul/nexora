import { CheckCircle, Clock, Users, Activity } from 'lucide-react';
import CardOverview from "../components/CardOverview";
import { useDashboard } from '../hooks/useDashboard';
import CardOverviewSkeleton from '../components/CardOverviewSkeleton';

export default function DashboardPage() {
  const {
    totalTasks,
    completedTasks,
    completionRate,
    totalWeekActivities,
    todayActivities,
    activeTeamsCount,
    loading,
    lastUpdateTime
  } = useDashboard();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Project Dashboard</h1>
            <p className="text-slate-600 mt-1">Overview of all your projects and tasks</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Activity className="w-4 h-4" />
            <span>Last updated: {loading ? "Updating..." : lastUpdateTime}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <CardOverviewSkeleton key={i} />
            ))) : (
            <>
              <CardOverview 
                title="Total Tasks"
                value={totalTasks}
                description="Across all projects"
                icon={Clock}
                borderColor="border-l-blue-500"
              />

              <CardOverview
                title="Completion Rate"
                value={`${completionRate} %`}
                description={`${completedTasks} Completed`}
                icon={CheckCircle}
                borderColor="border-l-green-500"
              />

              <CardOverview
                title="Activities This Week"
                value={totalWeekActivities}
                description={`${todayActivities} Today`}
                icon={Activity}
                borderColor="border-l-yellow-500"
              />

              <CardOverview
                title="Active Teams"
                value={activeTeamsCount}
                description="With active tasks"
                icon={Users}
                borderColor="border-l-purple-500"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
