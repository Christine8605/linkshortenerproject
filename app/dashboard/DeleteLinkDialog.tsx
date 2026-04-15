"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteLinkAction } from "./actions";

interface DeleteLinkDialogProps {
  id: number;
  shortCode: string;
}

export function DeleteLinkDialog({ id, shortCode }: DeleteLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setServerError(null);
    const result = await deleteLinkAction({ id });
    setLoading(false);
    if (result.success) {
      setOpen(false);
    } else {
      setServerError(result.error);
    }
  }

  function handleOpenChange(next: boolean) {
    if (!next) setServerError(null);
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" aria-label="Delete link">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete short link</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-mono font-medium text-foreground">
            {shortCode}
          </span>
          ? This action cannot be undone.
        </p>
        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
