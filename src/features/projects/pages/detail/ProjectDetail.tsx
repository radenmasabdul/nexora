/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FolderOpen, Loader2, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/formatDate";
import { useProjects } from "../../hooks/useProjects";
import PageContainer from "@/components/layout/PageContainer";
import GlobalDetailHeader from "@/components/layout/GlobalDetailHeader";
import GlobalConfirmModal from "@/components/layout/GlobalConfirmModal";
import GlobalSelect from "@/components/layout/GlobalSelect";
import GlobalErrorState from "@/components/layout/GlobalErrorState";
import GlobalCalendar from "@/components/layout/GlobalCalendar"

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selectedProject: project,
    loadingDetail: loading,
    errorFetch: error,
    fetchProjectsDetail,
    clearProjectDetail,
    humanizeStatus,
    getStatusBadgeColor,
    openConfirm,
    setOpenConfirm,
    openDeleteConfirm,
    handleDeleteProject,
    loadingMutation,
    isEditMode,
    setIsEditMode,
    updateProjectForm,
    updateProjectInitial,
    statusOptions,
    handleEditClick,
    handleCancelEdit,
    handleSubmitUpdate,
  } = useProjects();

  const { register, formState: { errors }, reset, setValue } = updateProjectForm;

  useEffect(() => {
    if (id) fetchProjectsDetail(id);
    return () => {
      clearProjectDetail();
      setIsEditMode(false);
    };
  }, [id]);

  useEffect(() => {
    if (project && isEditMode) {
      const formData = updateProjectInitial(project);
      reset(formData);
    }
  }, [isEditMode, project, updateProjectInitial, reset]);

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

  if (!project) {
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
        backTo="/projects"
        isEditMode={isEditMode}
        loading={loadingMutation}
        onEdit={() => project && handleEditClick(project)}
        onCancel={handleCancelEdit}
        onSave={id ? handleSubmitUpdate(id) : undefined}
        onDelete={() => openDeleteConfirm(project.id)}
        editLabel="Edit Project"
        deleteLabel="Delete Project"
      />

      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-5">
          <Card className="bg-surface rounded-xl shadow-sm border border-default p-5">
            <CardHeader>
              <CardTitle className="flex items-center gap-1 text-2xl font-bold text-primary">
                <FolderOpen className="w-8 h-8 text-blue-600" />
                Project Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {isEditMode ? (
                <>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="name" className="mb-2">Project Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Enter project name"
                        className={style}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
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
                        <Label htmlFor="status">Status</Label>
                        <GlobalSelect
                          options={statusOptions}
                          placeholder="Select Status"
                          contentClassName="z-[9999]"
                          groupClassName="bg-surface"
                          value={updateProjectForm.watch("status")}
                          onChange={(value) =>
                            setValue(
                              "status",
                              value as "" | "planning" | "in_progress" | "on_hold" | "completed"
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
                          value={updateProjectForm.watch("deadline") ? new Date(updateProjectForm.watch("deadline")) : undefined}
                          onChange={(date) => {
                            if (date) {
                              setValue("deadline", date.toISOString())
                            }
                          }}
                        />
                        {errors.deadline && (
                          <p className="text-sm text-red-600">{errors.deadline.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <CardTitle className="text-xl font-bold text-primary mb-2">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-secondary">
                    {project.description}
                  </CardDescription>

                  <Separator />
                  <div className="grid grid-cols-2 gap-4 pt-1 text-primary">
                    <div className="space-y-1.5">
                      <p className="text-sm">Status</p>
                      <Badge className={getStatusBadgeColor(project.status)}>
                        {humanizeStatus(project.status)}
                      </Badge>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm">Deadline</p>
                      <p className="text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(project.deadline)}
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
                <Users className="w-8 h-8 text-teal-600" />Team Information
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700 dark:text-teal-700 shrink-0">
                  {project.team?.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary">{project.team?.name}</p>
                  <p className="text-sm text-secondary leading-relaxed mt-2">{project.team?.description}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-primary">Team Members</h3>
                <Badge className="bg-info text-white">{project.team?.members?.length ?? 0} Members</Badge>
              </div>
              
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-4 p-0">
                  {!project.team?.members || project.team.members.length === 0 ? (
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
                    project.team.members.map((member, index) => (
                      <div key={index} className="flex items-center justify-between rounded-xl border p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 bg-gray-400">
                            {member.user.avatar_url ? (
                              <AvatarImage src={member.user.avatar_url} alt={member.user.name} />
                            ) : null}
                              <AvatarFallback className="font-semibold text-primary">
                                {member.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-primary">{member.user.name}</p>
                            <p className="text-sm text-muted-foreground text-primary">{member.user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-info text-white">
                            {member.role.split("_").map((w: string) => w[0].toUpperCase() + w.slice(1)).join(" ")}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>

      <GlobalConfirmModal
        open={openConfirm}
        title="Delete Project"
        description={`Are you sure you want to delete ${project.name}? This action cannot be undone.`}
        loading={loadingMutation}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={async () => {
          await handleDeleteProject(project.id);
          navigate("/projects");
        }}
      />
    </PageContainer>
  );
}