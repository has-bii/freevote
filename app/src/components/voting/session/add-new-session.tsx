"use client";

import { TVoting } from "@/types/model";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClockIcon } from "lucide-react";

type Props = {
  data: TVoting;
};

export default function AddNewSession({}: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <ClockIcon />
          New Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription>
            Set up a new session for your voting. Define the session details,
            including name, description, choices, and schedule.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
