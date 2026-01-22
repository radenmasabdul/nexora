import PageContainer from "@/components/layout/PageContainer";
import GlobalHeader from "@/components/layout/GlobalHeader";
import CardContent from "@/components/layout/CardContent";
import GlobalToolbar from "@/components/layout/GlobalToolbar";
import UsersModal from "../components/UsersModal";

export default function UsersPage() {
  const handleSearch = (payload: { keyword: string; filter: string }) => {
    console.log("keyword:", payload.keyword);
    console.log("filter:", payload.filter);
  };

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Member", value: "member" },
  ];

  return (
    <PageContainer>
      <GlobalHeader
        title="Users Management"
        description="Manage users and access the NEXORA system"
      />

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
      </CardContent>
    </PageContainer>
  )
}