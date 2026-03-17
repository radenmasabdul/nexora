import { Link } from "react-router-dom"
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTasks } from "../hooks/useTasks";
import PageContainer from "@/components/layout/PageContainer";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalToolbar from "@/components/layout/GlobalToolbar";
import GlobalDataTable from "@/components/layout/GlobalDataTable";
import CardContent from "@/components/layout/CardContent";

export default function TaskPage() {
    const {
        tableData,
        currentPage,
        totalData,
        loadingFetch,
        handlePageChange,
        handleSearch,
        statusOption,
        priorityOption
    } = useTasks();

    type TableRow = {
        id: string;
        title: string;
        description: string;
        status: string;
        priority: string;
        due_date: string;
    };

    const columns = [
        { key: 'title', header: 'Task Title', width: '25%'},
        { key: 'description', header: 'Description', width: '30%' },
        { key: 'status', header: 'Status', width: '15%' },
        { key: 'priority', header: 'Priority', width: '10%' },
        { key: 'due_date', header: 'Due Date', width: '12%'},
        {
            key: 'action',
            header: 'Action',
            width: '8%',
            render: (row: TableRow) => (
                <div className="flex justify-center gap-2">
                    <Link to={`/tasks/${row.id}`}>
                    <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    >
                        <Send className="w-4 h-4" />
                        View
                    </Button>
                    </Link>
                </div>
            )
        }
    ];

  return (
    <PageContainer>
        <GlobalHeader
        title="Tasks"
        description="Manage your tasks"
        />

        <CardContent>
            <div className="flex flex-wrap gap-2 md:gap-10 items-center">
                <div className="flex-1 min-w-70">
                    <GlobalToolbar
                    showSearch={true}
                    filters={[
                        {
                            key: "status",
                            options: statusOption,
                            placeholder: "Select status"
                        },
                        {
                            key: "priority",
                            options: priorityOption,
                            placeholder: "Select priority"
                        }
                    ]}
                    onSearch={handleSearch}
                    />
                </div>

                {/* <TaskModal /> */}
            </div>

            <GlobalDataTable
            columns={columns}
            data={tableData}
            page={currentPage}
            limit={10}
            total={totalData}
            onPageChange={handlePageChange}
            loading={loadingFetch}
            />
        </CardContent>
    </PageContainer>
  )
};