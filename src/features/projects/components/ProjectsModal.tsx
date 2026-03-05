import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import GlobalModal from "@/components/layout/GlobalModal"
import GlobalSelect from "@/components/layout/GlobalSelect"
import GlobalCalendar from "@/components/layout/GlobalCalendar"
import GlobalComboBox from "@/components/layout/GlobalComboBox"

import { useProjects } from "../hooks/useProjects"

export default function ProjectsModal() {
    const {
        teamList,
        statusOptions,
        selectedFormStatus,
        setSelectedFormStatus,
        projectDeadline,
        setProjectDeadline,
        onSubmit,
        saveNewForm,
        handleResetForm,
        openModal,
        setOpenModal,
        loadingMutation,
        setSearchTeam
    } = useProjects();

    const selectedTeamId = saveNewForm.watch("team_id");

    const style = `w-full pr-4 py-2.5 text-primary border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`;

  return (
    <GlobalModal
        icon={Plus}
        name="Add Projects"
        title="Add New Projects"
        description="Please fill in the details below to create a new projects."
        className="bg-surface"
        onSubmit={saveNewForm.handleSubmit(onSubmit)}
        onCancel={handleResetForm}
        open={openModal}
        onOpenChange={setOpenModal}
        loading={loadingMutation}
    >
        <div className="space-y-5 py-5">
            <div className="space-y-3">
                <Label htmlFor="teamName">Team Name</Label>
                <GlobalComboBox
                    options={teamList.map(team => ({
                        label: team.name,
                        value: team.id
                    }))}
                    value={selectedTeamId}
                    onChange={(val) => saveNewForm.setValue("team_id", val, { shouldValidate: true })}
                    onSearch={(keyword) => setSearchTeam(keyword)}
                    contentClassName="bg-surface"
                />
                {saveNewForm.formState.errors.team_id && (
                    <p className="text-red-500 text-sm">{saveNewForm.formState.errors.team_id.message}</p>
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                    type="text"
                    id="projectName"
                    placeholder="Project Name"
                    className={style}
                    {...saveNewForm.register("name")}
                />
                {saveNewForm.formState.errors.name && (
                    <p className="text-red-500 text-sm">{saveNewForm.formState.errors.name.message}</p>
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="description">Description</Label>
                <Input
                    type="text"
                    id="description"
                    placeholder="Description"
                    className={style}
                    {...saveNewForm.register("description")}
                />
                {saveNewForm.formState.errors.description && (
                    <p className="text-red-500 text-sm">{saveNewForm.formState.errors.description.message}</p>
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="status">Status</Label>
                <GlobalSelect
                    options={statusOptions}
                    placeholder="Select a status"
                    value={selectedFormStatus}
                    contentClassName="z-[9999]"
                    groupClassName="bg-surface"
                    onChange={(value) => {
                        const statusValue = value as "" | "active" | "on_hold" | "completed";
                        setSelectedFormStatus(statusValue);
                        if (statusValue) {
                            saveNewForm.setValue("status", statusValue);
                        }
                    }}
                />
                {saveNewForm.formState.errors.status && (
                    <p className="text-red-500 text-sm">{saveNewForm.formState.errors.status.message}</p>
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="deadline">Deadline</Label>
                <GlobalCalendar
                    value={projectDeadline}
                    onChange={(date) => {
                        setProjectDeadline(date)
                        if (date) {
                            saveNewForm.setValue("deadline", date.toISOString())
                        }
                    }}
                />
                {saveNewForm.formState.errors.deadline && (
                    <p className="text-red-500 text-sm">{saveNewForm.formState.errors.deadline.message}</p>
                )}
            </div>            
        </div>
    </GlobalModal>
  )
}