import PageContainer from "@/components/layout/PageContainer";
import GlobalHeader from "@/components/layout/GlobalHeader";
import CardContent from "@/components/layout/CardContent";
import GlobalToolbar from "@/components/layout/GlobalToolbar";
import UsersModal from "../components/UsersModal";
import CardRole from "../components/CardRole";
import GlobalDataTable from "@/components/layout/GlobalDataTable";
import { UserCircle2, Shield, Users, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useUsers } from "../hooks/useUsers";
import { CardSkeletonRoles } from "../components/CardSkeletonUser";
import GlobalConfirmModal from "@/components/layout/GlobalConfirmModal";

export default function UsersPage() {
  const {
    tableData,
    currentPage,
    totalData,
    handlePageChange,
    loadingFetch,
    loadingRoleCounts,
    handleSearch,
    roleOptions,
    roleCounts,
    openConfirm,
    setOpenConfirm,
    openDeleteConfirm,
    handleDeleteUser,
    loadingMutation,
    deleteId,
  } = useUsers();
  
  type TableRow = {
    id: string;
    name: string;
    email: string;
    role: string;
    join: string;
    avatar: string | null | undefined;
  };
  
  const columns = [
    { key: "email", header: "Email", width: "35%" },
    { key: "role", header: "Role", width: "20%" },
    { key: "join", header: "Join Date", width: "20%" },
    {
      key: "action",
      header: "Action",
      width: "25%",
      render: (row: TableRow) => (
        <div className="flex justify-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="text-amber-600 hover:text-amber-700 cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="text-red-600 hover:text-red-700 cursor-pointer"
            onClick={() => openDeleteConfirm(row.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    }
  ]

  return (
    <PageContainer>
      <GlobalHeader
        title="Users Management"
        description="Manage users and access the NEXORA system"
      />

      {loadingRoleCounts ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <CardSkeletonRoles />
          <CardSkeletonRoles />
          <CardSkeletonRoles />
        </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <CardRole
            title="Admin"
            value={roleCounts.admin}
            icon={Shield}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          
          <CardRole
            title="Manager"
            value={roleCounts.manager}
            icon={Users}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />

          <CardRole
            title="Member"
            value={roleCounts.member}
            icon={UserCircle2}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
        </div>
        )
      }

      <CardContent>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-70">
            <GlobalToolbar
              options={roleOptions}
              placeholder="Select Role"
              onSearch={handleSearch}
            />
          </div>

          <UsersModal />
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

        <GlobalConfirmModal
        open={openConfirm}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => handleDeleteUser(deleteId!)}
        loading={loadingMutation}
      />
      </CardContent>
    </PageContainer>
  )
}