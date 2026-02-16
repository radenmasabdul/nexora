import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeamMembers } from "../hooks/useTeamMembers";
import GlobalModal from "@/components/layout/GlobalModal";
import GlobalComboBox from "@/components/layout/GlobalComboBox";
import GlobalSelect from "@/components/layout/GlobalSelect";

type TeamMemberModalProps = {
  teamId: string;
  isEditMode: boolean;
  className?: string;
};

export default function TeamMemberModal({ teamId, isEditMode, className }: TeamMemberModalProps) {
  const {
    userList,
    roleOptions,
    onSubmit,
    saveNewForm,
    handleResetForm,
    openModal,
    setOpenModal,
    loadingMutation,
  } = useTeamMembers(teamId, isEditMode);

  const selectedUserId = saveNewForm.watch("user_id");
  const selectedRole = saveNewForm.watch("role");

  const selectedEmail = userList.find(u => u.id === selectedUserId)?.email || "";

  const style = `w-full pr-4 py-2.5 text-primary border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`;

  return (
    <GlobalModal
      icon={Plus}
      name="Add Team"
      title="Add New Team"
      description="Please fill in the details below to create a new team."
      className="bg-surface"
      classStyle={className}
      onSubmit={saveNewForm.handleSubmit(onSubmit)}
      onCancel={handleResetForm}
      open={openModal}
      onOpenChange={setOpenModal}
      loading={loadingMutation}
    >
      <div className="space-y-5 py-5">
        <div className="space-y-3">
          <Label htmlFor="fullname">Full Name</Label>
          <GlobalComboBox
            options={userList.map(user => ({
            label: user.name,
            value: user.id
          }))}
            value={selectedUserId}
            onChange={(val) => saveNewForm.setValue("user_id", val, { shouldValidate: true })}
            contentClassName="bg-surface"
          />
          {saveNewForm.formState.errors.user_id && (
            <p className="text-red-500 text-sm">{saveNewForm.formState.errors.user_id.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            className={style}
            value={selectedEmail}
            readOnly
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="role">Role</Label>
          <GlobalSelect
            options={roleOptions}
            placeholder="Select a role"
            value={selectedRole}
            onChange={(val) => saveNewForm.setValue("role", val as "" | "owner" | "lead" | "member", { shouldValidate: true })}
            contentClassName="bg-surface"
          />
          {saveNewForm.formState.errors.role && (
            <p className="text-red-500 text-sm">{saveNewForm.formState.errors.role.message}</p>
          )}
        </div>
      </div>
    </GlobalModal>
  );
}