"use client";

import { TParticipant } from "@/types/model";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalLeave } from "@/hooks/use-modal-leave";
import { QueryClient } from "@tanstack/react-query";
import { TSupabaseClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Loader, LogOut } from "lucide-react";
import { toast } from "sonner";

type Props = {
  data: TParticipant;
  query: QueryClient;
  supabase: TSupabaseClient;
};

export default function LeaveParticipant({ data, query, supabase }: Props) {
  const { isOpen, close } = useModalLeave();
  const [loading, setLoading] = React.useState(false);

  const leaveHandler = async () => {
    setLoading(true);
    const { error } = await supabase.from("voters").delete().eq("id", data.id);
    setLoading(false);

    if (error) {
      toast.error("Failed to leave the voting session");
      return;
    }

    close();
    query.invalidateQueries({ queryKey: ["participants", data.voting_id] });
    query.invalidateQueries({ queryKey: ["is participant", data.voting_id] });
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Voting Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave this voting session? Once you leave,
            you will lose access to vote and view session details. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={leaveHandler}
            disabled={loading}
          >
            Leave {loading ? <Loader className="animate-spin" /> : <LogOut />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
