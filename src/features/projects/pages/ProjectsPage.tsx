import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjects } from '../hooks/useProjects';
import PageContainer from '@/components/layout/PageContainer';
import GlobalHeader from '@/components/layout/GlobalHeader';
import GlobalToolbar from '@/components/layout/GlobalToolbar';
import GlobalDataTable from '@/components/layout/GlobalDataTable';
import CardContent from '@/components/layout/CardContent';
import ProjectsModal from '../components/ProjectsModal';

export default function ProjectsPage() {
  const {
    tableData,
    currentPage,
    totalData,
    handlePageChange,
    loadingFetch,
    handleSearch,
    statusOptions,
  } = useProjects();

  type TableRow = {
    id: string;
    name: string;
    description: string;
    status: string;
    deadline: string;
  }

  const columns = [
    { key: 'name', header: 'Project Name', width: '25%' },
    { key: 'description', header: 'Description', width: '35%' },
    { key: 'status', header: 'Status', width: '15%' },
    { key: 'deadline', header: 'Deadline', width: '20%' },
    {
      key: 'action',
      header: 'Action',
      width: '5%',
      render: (row: TableRow) => (
        <div className="flex justify-center gap-2">
          <Link to={`/users/${row.id}`}>
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
      ),
    }
  ]

  return (
    <PageContainer>
      <GlobalHeader
        title="Projects"
        description="Manage your projects"
      />

      <CardContent>
        <div className='flex flex-wrap gap-2 md:gap-10 items-center'>
          <div className='flex-1 min-w-70'>
            <GlobalToolbar
              showSearch={true}
              filters={[
                {
                  key: "status",
                  options: statusOptions,
                  placeholder: "Select Status"
                }
              ]}
              onSearch={handleSearch}
            />
          </div>

          <ProjectsModal />
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
}
