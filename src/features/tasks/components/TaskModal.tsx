import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import GlobalModal from "@/components/layout/GlobalModal"
import GlobalSelect from "@/components/layout/GlobalSelect"
import GlobalCalendar from "@/components/layout/GlobalCalendar"
import GlobalComboBox from "@/components/layout/GlobalComboBox"

import { useTasks } from "../hooks/useTasks"

export default function TaskModal() {
    const {
        projectList,
        userList,
        priorityOption,
        selectedPriority,
        setSelectedPriority,
        statusOption,
        selectedStatus,
        setSelectedStatus,
        dueDate,
        setDueDate,
        onSubmit,
        saveNewForm,
        handleResetForm,
        openModal,
        setOpenModal,
        loadingMutation,
        setSearchProject,
        setSearchUser,
    } = useTasks();

    const selectedProjectId = saveNewForm.watch("project_id");
    const selectedUserId = saveNewForm.watch("assign_to");

    const style = `w-full pr-4 py-2.5 text-primary border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`;
    
  return (
    <GlobalModal
    icon={Plus}
    name="Add Task"
    title="Add New Task"
    description="Please fill in the details below to create a new task."
    className="bg-surface"
    onSubmit={saveNewForm.handleSubmit(onSubmit)}
    onCancel={handleResetForm}
    open={openModal}
    onOpenChange={setOpenModal}
    loading={loadingMutation}
    >
        <div className="space-y-5 py-5">
            <div className="space-y-3">
                <Label htmlFor="projectId">Select Project</Label>
                <GlobalComboBox
                options={projectList.map(projects => ({
                    label: projects.name,
                    value: projects.id
                }))}
                value={selectedProjectId}
                onChange={(val) => saveNewForm.setValue("project_id", val, { shouldValidate: true })}
                onSearch={(keyword) => setSearchProject(keyword)}
                contentClassName="bg-surface"
                />
                {saveNewForm.formState.errors.project_id && (
                    <p className="text-red-500 text-sm">{saveNewForm.formState.errors.project_id.message}</p>
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="userId">Assign to</Label>
                <GlobalComboBox
                options={userList.map(users => ({
                    label: users.name,
                    value: users.id
                }))}
                value={selectedUserId}
                onChange={(val) => saveNewForm.setValue("assign_to", val, { shouldValidate: true })}
                onSearch={(keyword) => setSearchUser(keyword)}
                contentClassName="bg-surface"
                />
                {saveNewForm.formState.errors.assign_to && (
                    <p className="text-red-500 text-sm">{saveNewForm.formState.errors.assign_to.message}</p>
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="title">Title</Label>
                <Input
                type="text"
                id="title"
                placeholder="Task Title"
                className={style}
                {...saveNewForm.register("title")}
                />
                {saveNewForm.formState.errors.title && (
                    <p className="text-red-500 text-sm">{saveNewForm.formState.errors.title.message}</p>
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
                options={statusOption}
                placeholder="select a status"
                value={selectedStatus}
                contentClassName="z-[9999]"
                groupClassName="bg-surface"
                onChange={(value) => {
                    const statusValue = value as "" | "to_do" | "in_progress" | "review" | "done";
                    setSelectedStatus(statusValue);
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
                <Label htmlFor="priority">Priority</Label>
                <GlobalSelect
                options={priorityOption}
                placeholder="select a status"
                value={selectedPriority}
                contentClassName="z-[9999]"
                groupClassName="bg-surface"
                onChange={(value) => {
                    const priorityValue = value as "" | "low" | "medium" | "high";
                    setSelectedPriority(priorityValue);
                    if (priorityValue) {
                        saveNewForm.setValue("priority", priorityValue);
                    }
                }}
                />
                {saveNewForm.formState.errors.priority && (
                    <p className="text-red-500 text-sm">{saveNewForm.formState.errors.priority.message}</p>
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="dueDate">Due Date</Label>
                <GlobalCalendar
                key={openModal ? "open" : "closed"}
                value={dueDate}
                onChange={(date) => {
                    setDueDate(date)
                    if (date) {
                        saveNewForm.setValue("due_date", date.toISOString())
                    }
                }}
                />
                {saveNewForm.formState.errors.due_date && (
                    <p className="text-red-500 text-sm">{saveNewForm.formState.errors.due_date.message}</p>
                )}
            </div>
        </div>
    </GlobalModal>
  )
};