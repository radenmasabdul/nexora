/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FolderOpen, Loader2, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useTasks } from "../../hooks/useTasks";
import PageContainer from "@/components/layout/PageContainer";
import GlobalDetailHeader from "@/components/layout/GlobalDetailHeader";
import GlobalConfirmModal from "@/components/layout/GlobalConfirmModal";
import GlobalSelect from "@/components/layout/GlobalSelect";
import GlobalErrorState from "@/components/layout/GlobalErrorState";
import GlobalCalendar from "@/components/layout/GlobalCalendar";
import { formatDate } from "@/lib/formatDate";

export default function TaskDetail() {
  const { id } = useParams<{ id: string}>();
  const navigate = useNavigate();
  
  const {
    selectedTask: task,
    loadingDetail: loading,
    errorFetch: error,
    fetchTaskDetail,
    clearTaskDetail,
    humanize,
    getStatusBadgeColor,
    openConfirm,
    setOpenConfirm,
    openDeleteConfirm,
    handleDeleteTask,
    loadingMutation,
    isEditMode,
    setIsEditMode,
    updateTaskForm,
    updateTaskInitial,
    statusOption,
    priorityOption,
    handleEditClick,
    handleCancelEdit,
    handleSubmitUpdate
  } = useTasks();
  
  const { register, formState: { errors }, reset, setValue } = updateTaskForm;
  
  useEffect(() => {
    if (id) fetchTaskDetail(id);
    return () => {
      clearTaskDetail();
      setIsEditMode(false);
    };
  }, [id]);

  useEffect(() => {
    if (task && isEditMode) {
      const formData = updateTaskInitial(task);
      reset(formData);
    }
  }, [isEditMode, task, updateTaskInitial, reset]);

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
        <GlobalErrorState message={error} />
      </PageContainer>
    );
  }

  if (!task) {
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
      <GlobalDetailHeader
        backTo="/tasks"
        isEditMode={isEditMode}
        loading={loadingMutation}
        onEdit={() => task && handleEditClick(task)}
        onCancel={handleCancelEdit}
        onSave={id ? handleSubmitUpdate(id) : undefined}
        onDelete={() => openDeleteConfirm(task.id)}
        editLabel="Edit Task"
        deleteLabel="Delete Task"
      />
      
      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-5">
          <Card className="bg-surface rounded-xl shadow-sm border border-default p-5">
            <CardHeader>
              <CardTitle className="flex items-center gap-1 text-2xl font-bold text-primary">
                <FolderOpen className="w-8 h-8 text-blue-600" />
                Task Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {isEditMode ? (
                <>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="title" className="mb-2">Task Title</Label>
                      <Input
                        id="title"
                        {...register("title")}
                        placeholder="Enter task title"
                        className={style}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <Field>
                        <FieldLabel htmlFor="textarea-message">Description</FieldLabel>
                        <Textarea
                          id="textarea-message"
                          placeholder="Type your description here."
                          className={style}
                          {...register("description")}
                        />
                        {errors.description && (
                          <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                        )}
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <GlobalSelect
                          options={priorityOption}
                          placeholder="Select Priority"
                          contentClassName="z-[9999]"
                          groupClassName="bg-surface"
                          value={updateTaskForm.watch("priority")}
                          onChange={(value) =>
                            setValue(
                              "priority",
                              value as "" | "low" | "medium" | "high"
                            )
                          }
                        />
                        {errors.priority && (
                          <p className="text-sm text-red-600">{errors.priority.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <GlobalSelect
                          options={statusOption}
                          placeholder="Select Status"
                          contentClassName="z-[9999]"
                          groupClassName="bg-surface"
                          value={updateTaskForm.watch("status")}
                          onChange={(value) =>
                            setValue(
                              "status",
                              value as "" | "to_do" | "in_progress" | "review" | "done"
                            )
                          }
                        />
                        {errors.status && (
                          <p className="text-sm text-red-600">{errors.status.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deadline">Deadline</Label>
                        <GlobalCalendar
                          value={updateTaskForm.watch("due_date") ? new Date(updateTaskForm.watch("due_date")) : undefined}
                          onChange={(date) => {
                            if (date) {
                              setValue("due_date", date.toISOString())
                            }
                          }}
                        />
                        {errors.due_date && (
                          <p className="text-sm text-red-600">{errors.due_date.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <CardTitle className="text-xl font-bold text-primary mb-2">
                    {task.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-secondary">
                    {task.description}
                  </CardDescription>

                  <Separator />
                  <div className="grid grid-cols-2 gap-4 pt-1 text-primary">
                    <div className="space-y-1.5">
                      <p className="text-sm">Status</p>
                      <Badge className={getStatusBadgeColor(task.status)}>
                        {humanize(task.status)}
                      </Badge>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm">Deadline</p>
                      <p className="text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(task.due_date)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-surface rounded-xl shadow-sm border border-default p-5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-primary">
                <Users className="w-8 h-8 text-teal-600" />Projects Information
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 m-0">
                <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700 dark:text-teal-700 shrink-0">
                  {task.project?.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary">{task.project?.name}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-primary">Assigned User</h3>
              </div>
              
              <Card className="border-0 shadow-none p-0">
                <CardContent className="space-y-4 p-0">
                  {!task.assignedUser ? (
                    <div className="flex items-center justify-between rounded-xl border border-dashed p-4 opacity-70">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 bg-gray-400">
                          <AvatarFallback className="font-semibold text-muted-foreground text-primary">?</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-muted-foreground text-primary">No team members</p>
                          <p className="text-sm text-muted-foreground text-primary">No members assigned to this team</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-gray-400 text-white">—</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border p-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-primary">{task.assignedUser.name}</p>
                          <p className="text-sm text-muted-foreground text-primary">{task.assignedUser.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>

      <GlobalConfirmModal
        open={openConfirm}
        title="Delete Task"
        description={`Are you sure you want to delete ${task.title}? This action cannot be undone.`}
        loading={loadingMutation}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={async () => {
          await handleDeleteTask(task.id);
          navigate("/tasks");
        }}
      />
    </PageContainer>
  )
}
