import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export default function GlobalConfirmModal({
  open,
  title = "Confirm",
  description = "Are you sure?",
  onConfirm,
  onCancel,
  loading,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="bg-surface">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">{description}</p>

        <DialogFooter>
            <Button variant="outline" onClick={onCancel} className="cursor-pointer">
                Cancel
            </Button>

            <Button
                onClick={onConfirm}
                disabled={loading}
                className="bg-red-600 text-white font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center min-w-30">
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    "Delete"
                )}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
