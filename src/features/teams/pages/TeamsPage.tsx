import { Link } from "react-router-dom";
import { Send } from 'lucide-react';
import PageContainer from "@/components/layout/PageContainer";
import GlobalHeader from "@/components/layout/GlobalHeader";
import CardContent from "@/components/layout/CardContent";
import GlobalToolbar from "@/components/layout/GlobalToolbar";
import GlobalDataTable from "@/components/layout/GlobalDataTable";
import TeamsModal from "../components/TeamsModal";
import { Button } from "@/components/ui/button";
import { useTeams } from "../hooks/useTeams";

export default function TeamsPage() {
  const {
    tableData,
    currentPage,
    totalData,
    handlePageChange,
    loadingFetch,
    handleSearch,
  } = useTeams();

  type TableRow = {
    id: string;
    name: string;
    description: string;
    created_at: string;
  };

  const columns = [
    { key: "name", header: "Team Name", width: "40%" },
    { key: "description", header: "Description", width: "40%" },
    {
      key: "action",
      header: "Action",
      width: "20%",
      render: (row: TableRow) => (
        <div className="flex justify-center gap-2">
          <Link to={`/teams/${row.id}`}>
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
  ];

  return (
    <PageContainer>
      <GlobalHeader
        title="Teams"
        description="Manage your organization teams"
      />

      <CardContent>
        <div className="flex flex-wrap gap-2 md:gap-10 items-center">
          <div className="flex-1 min-w-70">
            <GlobalToolbar
              showSearch={true}
              filters={[]}
              onSearch={({ keyword }) => handleSearch({ keyword })}
            />
          </div>

          <TeamsModal />
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