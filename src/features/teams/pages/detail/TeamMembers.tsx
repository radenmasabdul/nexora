import { Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/formatDate";
import { useTeamMembers } from "../../hooks/useTeamMembers";
import TeamMemberModal from "../../components/TeamMemberModal";
import GlobalConfirmModal from "@/components/layout/GlobalConfirmModal";

interface TeamMembersProps {
  teamId: string;
  isEditMode: boolean;
};

export default function TeamMembers({ teamId, isEditMode }: TeamMembersProps) {

  const {
    teamMemberList,
    loadingFetch,
    openDeleteConfirm,
    openConfirm,
    setOpenConfirm,
    handleDeleteMember,
    deleteId,
    loadingMutation
  } = useTeamMembers(teamId);

  return (
    <main>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-primary">Team Members</h3>
          <Badge className="bg-info text-white">{teamMemberList.length} Members</Badge>
        </div>
        
        <TeamMemberModal 
          teamId={teamId}
          isEditMode={isEditMode}
          className={`${!isEditMode ? "hidden" : ""}`}
        />
      </div>

      <Card className="border-0 shadow-none">
        <CardContent className="space-y-4 p-4">
          {loadingFetch && 
            <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          }

          {!loadingFetch && teamMemberList.length === 0 && (
            <div className="flex items-center justify-between rounded-xl border border-dashed p-4 opacity-70">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 bg-gray-400">
                  <AvatarFallback className="font-semibold text-muted-foreground text-primary">?</AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-medium text-muted-foreground text-primary">No team members</p>
                  <p className="text-sm text-muted-foreground text-primary">Invite your first member to get started</p>
                </div>
              </div>
              
              <div className="text-right">
                <Badge className="bg-error text-white">—</Badge>
                <p className="mt-1 text-xs text-muted-foreground text-primary">—</p>
              </div>
            </div>
          )}

          {teamMemberList.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 bg-gray-400">
                  <AvatarFallback className="font-semibold text-primary">
                    {member.user.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-medium text-primary">{member.user.name}</p>
                  <p className="text-sm text-muted-foreground text-primary">{member.user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <Badge className="bg-info text-white">{member.role}</Badge>
                  <p className="mt-1 text-xs text-muted-foreground text-primary">Joined {formatDate(member.joined_at)}</p>
                </div>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className={`text-red-500 hover:text-red-600 cursor-pointer ${!isEditMode ? "hidden" : ""}`}
                  onClick={() => openDeleteConfirm(member.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <GlobalConfirmModal
        open={openConfirm}
        title="Delete Team Member"
        description="Are you sure you want to remove this member from the team?"
        onConfirm={() => deleteId && handleDeleteMember(deleteId)}
        onCancel={() => setOpenConfirm(false)}
        loading={loadingMutation}
        isEditMode={isEditMode}
        className={`${!isEditMode ? "hidden" : ""}`}
      />
    </main>
  )
}
