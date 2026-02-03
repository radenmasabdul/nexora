import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useTeams } from "../hooks/useTeams";
import GlobalModal from "@/components/layout/GlobalModal";

export default function TeamsModal() {
  const {
    onSubmit,
    saveNewForm,
    handleResetForm,
    openModal,
    setOpenModal,
    loadingMutation
  } = useTeams();

  const style = `w-full pr-4 py-2.5 text-primary border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`;

  return (
    <GlobalModal
      icon={Plus}
      name="Add Team"
      title="Add New Team"
      description="Please fill in the details below to create a new team."
      className="bg-surface"
      onSubmit={saveNewForm.handleSubmit(onSubmit)}
      onCancel={handleResetForm}
      open={openModal}
      onOpenChange={setOpenModal}
      loading={loadingMutation}
    >
      <div className="space-y-5 py-5">
        <div className="space-y-3">
          <Label htmlFor="teamname">Team Name</Label>
          <Input
            type="text"
            id="teamname"
            placeholder="Team Name"
            className={style}
            {...saveNewForm.register("name")}
          />
          {saveNewForm.formState.errors.name && (
            <p className="text-red-500 text-sm">{saveNewForm.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Field>
            <FieldLabel htmlFor="textarea-message">Description</FieldLabel>
            <Textarea
              id="textarea-message"
              placeholder="Type your description here."
              {...saveNewForm.register("description")}
            />
            {saveNewForm.formState.errors.description && (
              <p className="text-red-500 text-sm">{saveNewForm.formState.errors.description.message}</p>
            )}
          </Field>
        </div>
      </div>
    </GlobalModal>
  )
};