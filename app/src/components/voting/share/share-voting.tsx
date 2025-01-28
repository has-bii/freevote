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
import { Fingerprint } from "lucide-react";

export default function ShareVoting() {
  const { close, id } = useShareVoting();
  const [isCopied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (isCopied) setTimeout(() => setCopied(false), 2000);
  }, [isCopied]);

  return (
    <Dialog open={id !== null} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Voting Session</DialogTitle>
          <DialogDescription>
            {/* Invite others to join your voting session by sharing the unique
            Voting ID or a direct link. Choose your preferred sharing method
            below. */}
            Invite others to join your voting session by sharing the unique
            Voting ID. Choose your preferred sharing method below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(id!);
              setCopied(true);
            }}
            disabled={isCopied}
          >
            <Fingerprint />
            {isCopied ? "Copied" : "Copy ID"}
          </Button>
          <Button onClick={close}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
