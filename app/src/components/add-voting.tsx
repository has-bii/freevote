"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  children: React.ReactNode;
};

export default function AddVoting({ children }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Voting</DialogTitle>
          <DialogDescription>
            Provide a name, optional description, and type for your new voting
            session.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
