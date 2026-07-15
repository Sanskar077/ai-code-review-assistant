"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewTitle: string;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteReviewDialog({
  open,
  onOpenChange,
  reviewTitle,
  onConfirm,
  isDeleting,
}: DeleteReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this review?</DialogTitle>
          <DialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">&ldquo;{reviewTitle}&rdquo;</span>, along with
            its code submission and all findings. This action can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDeleting ? "Deleting…" : "Delete review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
