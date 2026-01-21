import { CheckCircle, Clock, Users, Activity } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { CardOverviewSkeleton, CardChartSkeleton, CardSkeletonTimeline, CardSkeletonTask } from '../components/CardSkeleton';
import CardOverview from "../components/CardOverview";
import CardChart from '../components/CardChart';
import PieChart from '../components/chart/PieChartData';
import BarChartData from '../components/chart/BarChartData';
import LineChartData from '../components/chart/LineChartData';

export default function DashboardPage() {
  const {
    loading,
    lastUpdateTime,
    formattedTaskStatus,
    formattedTaskPriorities,
    topTaskWorkload,
    workloadColors,
    topProjectProgress,
    projectProgressColors,
    totalTasks,
    completedTasks,
    completionRate,
    totalWeekActivities,
    todayActivities,
    activeTeamsCount,
    activityRange,
    setActivityRange,
    activityData,
    topTeamsByTasks
  } = useDashboard();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Project Dashboard</h1>
            <p className="mt-1 text-secondary">Overview of all your projects and tasks</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary">
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
                textColor='text-secondary'
              />

              <CardOverview
                title="Completion Rate"
                value={`${completionRate} %`}
                description={`${completedTasks} Completed`}
                icon={CheckCircle}
                borderColor="border-l-green-500"
                textColor='text-secondary'
              />

              <CardOverview
                title="Activities This Week"
                value={totalWeekActivities}
                description={`${todayActivities} Today`}
                icon={Activity}
                borderColor="border-l-yellow-500"
                textColor='text-secondary'
              />

              <CardOverview
                title="Active Teams"
                value={activeTeamsCount}
                description="With active tasks"
                icon={Users}
                borderColor="border-l-purple-500"
                textColor='text-secondary'
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <CardChartSkeleton key={i} />
            ))) : (
            <>
              <CardChart
                title="Task Status"
                description="Current status distribution of all tasks"
              >
                <PieChart
                  data={formattedTaskStatus}
                  dataKey="count"
                  nameKey="status"
                  colors={["#3B82F6", "#10B981", "#F59E0B"]}
                />
              </CardChart>

              <CardChart
                title="Task Priority"
                description="Tasks grouped by priority level"
              >
                <BarChartData
                  data={formattedTaskPriorities}
                  dataKey="count"
                  nameKey="priority"
                  colors={["#F59E0B", "#EF4444", "#10B981"]}
                  tooltipLabel="Count"
                />
              </CardChart>

              <CardChart
                title="User Workload"
                description="Top 10 users by task count"
              >
                <BarChartData
                  data={topTaskWorkload}
                  dataKey="workload"
                  nameKey="name"
                  colors={workloadColors}
                  layout="vertical"
                  tooltipLabel="Workload"
                />
              </CardChart>

              <CardChart
                title="Project Progress"
                description="Top 10 projects by completion percentage"
              >
                <BarChartData
                  data={topProjectProgress}
                  dataKey="progress"
                  nameKey="project_name"
                  colors={projectProgressColors}
                  layout="vertical"
                  customFormatter={(value: number | string | undefined, name: string | undefined, props: { payload?: Record<string, unknown> }) => {
                    if (name === 'progress' && props.payload) {
                      return [
                        `${value}% (${props.payload.done_tasks}/${props.payload.total_tasks} tasks)`, 
                        'Progress'
                      ];
                    }
                    return [String(value || ''), String(name || '')];
                  }}
                />
              </CardChart>
            </>
          )}
        </div>

        <div className='grid grid-cols-1 gap-6'>
          {loading ? (
            <>
              <CardSkeletonTimeline />
              <CardSkeletonTask />
            </>
          ) : (
            <>
              <CardChart
                title="Activity Timeline"
                description="Activity count over time"
              >
                <div className="flex justify-end gap-2 py-2">
                  {(['day', 'week', 'month', 'year'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setActivityRange(range)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors cursor-pointer ${
                        activityRange === range
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                </div>
              
                <LineChartData
                  data={activityData}
                  dataKey="total"
                  nameKey="period"
                  color="#3B82F6"
                />
              </CardChart>

              <CardChart
                title="Tasks by Team"
                description='Top 10 Teams with active tasks'
              >
                <div className="space-y-4">
                  {topTeamsByTasks.map((team, index) => {
                    const maxTasks = Math.max(...topTeamsByTasks.map(t => t.task_count));

                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div
                          className="w-48 font-medium text-primary truncate"
                          title={team.team_name}
                        >
                          {team.team_name}
                        </div>
                    
                        <div className="flex-1 bg-slate-200 rounded-full h-8 relative overflow-hidden">
                          <div
                            className="bg-linear-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium transition-all duration-500"
                            style={{ width: `${Math.min((team.task_count / maxTasks) * 100, 100)}%`}}
                          >
                            {team.task_count} {team.task_count === 1 ? "task" : "tasks"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardChart>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
