"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShareVoting } from "./use-share-voting";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";

export default function ShareVoting() {
  const { close, id } = useShareVoting();

  return (
    <Dialog open={id !== null} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Voting Session</DialogTitle>
          <DialogDescription>
            Invite others to join your voting session by sharing the unique
            Voting ID or a direct link. Choose your preferred sharing method
            below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() =>
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_APP_URL}/join/${id}`,
              )
            }
          >
            <LinkIcon />
            Copy link
          </Button>
          <Button onClick={close}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
