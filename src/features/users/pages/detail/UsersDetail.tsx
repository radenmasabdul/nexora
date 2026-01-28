import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, Calendar, User, Shield, ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUsers } from "../../hooks/useUsers";
import PageContainer from "@/components/layout/PageContainer";
import GlobalConfirmModal from "@/components/layout/GlobalConfirmModal";

export default function UsersDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selectedUser: user,
    loadingFetch: loading,
    errorFetch: error,
    fetchUserDetail,
    clearUserDetail,
    getInitials,
    formatDate,
    getRoleBadgeColor,
    openConfirm,
    setOpenConfirm,
    openDeleteConfirm,
    handleDeleteUser,
    loadingMutation,
  } = useUsers();

  useEffect(() => {
    if (id) fetchUserDetail(id);

    return () => {
      clearUserDetail();
    };
  }, [id, fetchUserDetail, clearUserDetail]);

  if (loading) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pt-6 text-center text-red-700">
            {error}
          </CardHeader>
        </Card>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer" onClick={() => navigate("/users")}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex gap-2">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profil
          </Button>

          <Button className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            onClick={() => openDeleteConfirm(user.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>

      <Card className="bg-surface rounded-xl shadow-sm border border-default p-5">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-surface shadow-md">
              <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
              <AvatarFallback className="text-2xl font-semibold bg-surface text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <CardTitle className="text-3xl font-bold text-primary">
                  {user.name}
                </CardTitle>
              </div>

              <CardDescription className="flex items-center gap-2 text-base text-primary">
                <Mail className="w-4 h-4" />
                {user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-surface rounded-xl shadow-sm border border-default p-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-1 text-xl text-primary">
            <User className="w-5 h-5 text-blue-600" />
            Account Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Email</p>
            <p className="text-sm text-primary">{user.email}</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium text-primay">Role</p>
            <div>
              <Badge className={getRoleBadgeColor(user.role)}>
                <Shield className="w-3 h-3 mr-1" />
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface rounded-xl shadow-sm border border-default p-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-primary">
            <Calendar className="w-5 h-5 text-green-600" />
            Activity
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Created At</p>
            <p className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {formatDate(user.created_at)}
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Last Updated</p>
            <p className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {formatDate(user.updated_at)}
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Account Status</p>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Aktif
            </Badge>
          </div>
        </CardContent>
      </Card>

      <GlobalConfirmModal
        open={openConfirm}
        title="Delete Account"
        description={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
        loading={loadingMutation}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={async () => {
          await handleDeleteUser(user.id);
        navigate("/users");
        }}
      />
    </PageContainer>
  )
}