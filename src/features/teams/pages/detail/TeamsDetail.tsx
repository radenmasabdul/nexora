/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Shield, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useTeams } from "../../hooks/useTeams";
import PageContainer from "@/components/layout/PageContainer";
import GlobalDetailHeader from "@/components/layout/GlobalDetailHeader";
import GlobalErrorState from "@/components/layout/GlobalErrorState";
import GlobalConfirmModal from "@/components/layout/GlobalConfirmModal";
import TeamMembers from "./TeamMembers";

export default function TeamsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    selectedTeam: team,
    loadingDetail: loading,
    errorFetch: error,
    fetchTeamDetail,
    clearTeamDetail,
    openConfirm,
    setOpenConfirm,
    openDeleteConfirm,
    handleDeleteTeam,
    loadingMutation,
    isEditMode,
    setIsEditMode,
    updateTeamForm,
    updateTeamInitial,
    handleEditClick,
    handleCancelEdit,
    handleSubmitUpdate
  } = useTeams();

  const { register, formState: { errors }, reset } = updateTeamForm;

  useEffect(() => {
    if (id) fetchTeamDetail(id);

    return () => {
      clearTeamDetail();
      setIsEditMode(false);
    };
  }, [id]);

  useEffect(() => {
    if (team && isEditMode) {
      const formData = updateTeamInitial(team);
      reset(formData);
    }
  }, [isEditMode, team, updateTeamInitial, reset]);

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

  if (!team) {
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
        backTo="/teams"
        isEditMode={isEditMode}
        loading={loadingMutation}
        onEdit={() => team && handleEditClick(team)}
        onCancel={handleCancelEdit}
        onSave={id ? handleSubmitUpdate(id) : undefined}
        onDelete={() => openDeleteConfirm(team.id)}
        editLabel="Edit Team"
        deleteLabel="Delete Team"
      />

      <Card className="bg-surface rounded-xl shadow-sm border border-default p-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-1 text-2xl font-bold text-primary">
            <Shield className="w-8 h-8 text-blue-600" />
            Team Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditMode ? (
            <>
            <div className="space-y-2">
              <div>
                <Label htmlFor="name" className="mb-2">Team Name</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter team name"
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
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                    )}
                </Field>
              </div>
            </div>
            </>
          ) : (
            <>
            <CardTitle className="text-xl font-bold text-primary mb-2">
              {team.name}
            </CardTitle>
            <CardDescription className="text-sm text-secondary">
              {team.description}
            </CardDescription>
            </>
          )}

          <TeamMembers teamId={team.id} isEditMode={isEditMode}/>
          
        </CardContent>
      </Card>
      
      <GlobalConfirmModal
        open={openConfirm}
        title="Delete Account"
        description={`Are you sure you want to delete ${team.name}? This action cannot be undone.`}
        loading={loadingMutation}
        onCancel={() => setOpenConfirm(false)}
        onConfirm={async () => {
          await handleDeleteTeam(team.id);
          navigate("/teams");
        }}
      />
    </PageContainer>
  )
}
