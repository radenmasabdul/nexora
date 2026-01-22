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
    title?: string;
    description?: string;
    cancelText?: string;
    submitText?: string;
    icon: LucideIcon;
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
}

export default function GlobalModal({ name, className, title, description, cancelText = "Cancel", submitText = "Save", icon: Icon, children,  onSubmit } : GlobalModalProps) {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" className="bg-blue-600 text-white px-4 py-5 rounded-lg cursor-pointer">
                <Icon className="w-4 h-4 text-white" />
                <span className="text-white">{name}</span>
            </Button>
        </DialogTrigger>
        <DialogContent className={`${className} z-50`}>
            <form onSubmit={onSubmit}>
            <DialogHeader className="text-primary">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <div>{children}</div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">{cancelText}</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button type="button" onClick={onSubmit}>{submitText}</Button>
                </DialogClose>
            </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  )
}