import { ArrowLeft, Edit, Trash2, X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  backTo: string
  isEditMode: boolean
  loading?: boolean

  onEdit?: () => void
  onCancel?: () => void
  onSave?: () => void
  onDelete?: () => void

  editLabel?: string
  deleteLabel?: string
}

export default function GlobalDetailHeader({
    backTo,
    isEditMode,
    loading,
    onEdit,
    onCancel,
    onSave,
    onDelete,
    editLabel = "Edit",
    deleteLabel = "Delete"
}: Props) {
    const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer"
        onClick={() => navigate(backTo)}
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
              onClick={onCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={onSave}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </>
        ) : (
          <>
            {onEdit && (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                onClick={onEdit}
              >
                <Edit className="w-4 h-4 mr-2" />
                {editLabel}
              </Button>
            )}

            {onDelete && (
              <Button
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteLabel}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
};