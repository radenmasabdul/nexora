import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { LucideIcon } from 'lucide-react';

type GlobalModalProps = {
  name: string;
  className?: string;
  classStyle?: string;
  title?: string;
  description?: string;
  cancelText?: string;
  submitText?: string;
  icon: LucideIcon;
  open: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  onOpenChange: (open: boolean) => void;
};

export default function GlobalModal({ 
  name, 
  className,
  classStyle,
  title, 
  description, 
  cancelText = "Cancel", 
  submitText = "Save", 
  icon: Icon,
  open,
  loading,
  children,  
  onSubmit, 
  onCancel,
  onOpenChange
}: GlobalModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
            <Button variant="outline" className={`bg-blue-600 text-white px-4 py-5 rounded-lg cursor-pointer ${classStyle}`}>
                <Icon className="w-4 h-4 text-white" />
                <span className="text-white">{name}</span>
            </Button>
        </DialogTrigger>
        <DialogContent className={`${className} z-50 [&>button]:hidden`}>
            <form onSubmit={onSubmit}>
              <DialogHeader className="text-primary">
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              <div>{children}</div>
              <DialogFooter>
                  <DialogClose asChild>
                      <Button type="button" variant="outline" className="bg-red-600 hover:bg-red-700 text-white cursor-pointer" onClick={onCancel}>
                        {cancelText}
                      </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center min-w-30">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        submitText
                      )}
                  </Button>
              </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}