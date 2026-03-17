import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Plus } from "lucide-react"
import GlobalModal from "@/components/layout/GlobalModal"
import GlobalSelect from "@/components/layout/GlobalSelect"

import { useUsers } from "../hooks/useUsers"

export default function UsersModal() {
  const {
    roleOptions,
    selectedFormRole,
    setSelectedFormRole,
    showPassword,
    togglePassword,
    onSubmit,
    saveNewForm,
    handleResetForm,
    openModal,
    setOpenModal,
    loadingMutation,
  } = useUsers();

  const style = `w-full pr-4 py-2.5 text-primary border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`;
  
  return (
    <GlobalModal
      icon={Plus}
      name="Add User"
      title="Add New User"
      description="Please fill in the details below to create a new user."
      className="bg-surface"
      onSubmit={saveNewForm.handleSubmit(onSubmit)}
      onCancel={handleResetForm}
      open={openModal}
      onOpenChange={setOpenModal}
      loading={loadingMutation}
    >
      <div className="space-y-5 py-5">
        <div className="space-y-3">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            type="text"
            id="fullname"
            placeholder="Full Name"
            className={style}
            {...saveNewForm.register("name")}
          />
          {saveNewForm.formState.errors.name && (
            <p className="text-red-500 text-sm">{saveNewForm.formState.errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email" 
            id="email" 
            placeholder="you@example.com"
            autoComplete="email"
            className={style}
            {...saveNewForm.register("email")}
          />
          {saveNewForm.formState.errors.email && (
            <p className="text-red-500 text-sm">{saveNewForm.formState.errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className={style}
              {...saveNewForm.register("password")}
            />
            
            <Button
              type="button"
              size="icon"
              onClick={togglePassword}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>
          {saveNewForm.formState.errors.password && (
            <p className="text-red-500 text-sm">{saveNewForm.formState.errors.password.message}</p>
          )}
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="role">Role</Label>
          <GlobalSelect
            options={roleOptions}
            placeholder="Select a role"
            value={selectedFormRole}
            contentClassName="z-[9999]"
            groupClassName="bg-surface"
            onChange={(value) => {
              const roleValue = value as "" | "administrator" | "manager_division" | "project_owner" | "staff";
              setSelectedFormRole(roleValue);
              if (roleValue) {
                saveNewForm.setValue("role", roleValue);
              }
            }}
          />
          {saveNewForm.formState.errors.role && (
            <p className="text-red-500 text-sm">{saveNewForm.formState.errors.role.message}</p>
          )}
        </div>
      </div>
    </GlobalModal>
  )
}