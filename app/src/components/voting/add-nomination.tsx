"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddNomination } from "../../hooks/use-modal-add-nomination";

type Props = {
  id: string;
};

export default function AddNomination({ id }: Props) {
  const { close, state } = useAddNomination();

  return (
    <Dialog open={state} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
