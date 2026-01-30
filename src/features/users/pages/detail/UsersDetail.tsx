/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, Calendar, User, Shield, ArrowLeft, Edit, Trash2, Loader2, X, Save, Eye, EyeOff, Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUsers } from "../../hooks/useUsers";
import PageContainer from "@/components/layout/PageContainer";
import GlobalConfirmModal from "@/components/layout/GlobalConfirmModal";
import GlobalSelect from "@/components/layout/GlobalSelect";

export default function UsersDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selectedUser: user,
    loadingDetail: loading,
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
    isEditMode,
    setIsEditMode,
    updateUserForm,
    updateUserInitial,
    roleOptions,
    showPassword,
    togglePassword,
    previewAvatar,
    fileInputRef,
    handleEditClick,
    handleCancelEdit,
    handleOpenCamera,
    handleAvatarChange,
    handleSubmitUpdate,
  } = useUsers();

  const { register, formState: { errors }, reset, setValue } = updateUserForm;

  useEffect(() => {
    if (id) fetchUserDetail(id);

    return () => {
      clearUserDetail();
      setIsEditMode(false);
    };
  }, [id]);

  useEffect(() => {
    if (user && isEditMode) {
      const formData = updateUserInitial(user);
      reset(formData);
    }
  }, [isEditMode, user, updateUserInitial, reset]);

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
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  const style = `w-full pr-4 py-2.5 text-primary border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`;

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer" 
          onClick={() => navigate("/users")}
          disabled={isEditMode}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex gap-2">
          {isEditMode ? (
            <>
              <Button 
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                onClick={handleCancelEdit}
                disabled={loadingMutation}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                onClick={id ? handleSubmitUpdate(id) : undefined}
                disabled={loadingMutation}
              >
                {loadingMutation ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                onClick={() => user && handleEditClick(user)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>

              <Button 
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                onClick={() => openDeleteConfirm(user.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="bg-surface rounded-xl shadow-sm border border-default p-5">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {isEditMode && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            )}
            
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-surface shadow-md">
                <AvatarImage
                  src={
                    previewAvatar ||
                    (user.avatar_url
                    ? `${user.avatar_url}?t=${user.updated_at}`
                    : undefined)
                  }
                  alt={user.name}
                />
                <AvatarFallback className="text-2xl font-semibold bg-surface text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              {isEditMode && (
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full shadow-lg cursor-pointer"
                  onClick={handleOpenCamera}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-2">
              {isEditMode ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="mb-2">Full Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Enter name"
                      className={style}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="mb-2">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="Enter email"
                      className={style}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <CardTitle className="text-3xl font-bold text-primary">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base text-primary">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </CardDescription>
                </>
              )}
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
          {isEditMode ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="password" className="mb-2">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter new password (optional)"
                    className={style}
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={togglePassword}
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-primary" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <GlobalSelect
                  options={roleOptions}
                  placeholder="Select role"
                  contentClassName="z-[9999]"
                  groupClassName="bg-surface"
                  value={updateUserForm.watch("role")}
                  onChange={(value) =>
                    setValue(
                      "role",
                      value as "admin" | "manager" | "member" | ""
                    )
                  }
                />
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary">Email</p>
                <p className="text-sm text-primary">{user.email}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-primary">Role</p>
                <div>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {!isEditMode && (
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
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

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
  );
}