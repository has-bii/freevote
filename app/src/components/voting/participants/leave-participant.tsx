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
import { useRouter } from "next/navigation";
import { revalidateParticipant } from "@/app/(api)/api/participant/[voting_id]/get-participant-cached";
import { revalidateResultByVotingId } from "@/app/(api)/api/result/[session_id]/get-result-cached";

type Props = {
  data: TParticipant;
  query: QueryClient;
  supabase: TSupabaseClient;
};

export default function LeaveParticipant({ data, query, supabase }: Props) {
  const { isOpen, close } = useModalLeave();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const leaveHandler = async () => {
    setLoading(true);
    const { error } = await supabase.from("voters").delete().eq("id", data.id);
    setLoading(false);

    if (error) {
      setLoading(false);
      toast.error("Failed to leave the voting session");
      return;
    }

    await revalidateParticipant(data.voting_id);
    await revalidateResultByVotingId(data.voting_id);
    setLoading(false);
    close();
    query.invalidateQueries({ queryKey: ["joined votings"] });
    query.invalidateQueries({ queryKey: ["participants", data.voting_id] });
    query.invalidateQueries({ queryKey: ["is participant", data.voting_id] });
    router.push("/votings");
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
            {loading ? <Loader className="animate-spin" /> : <LogOut />}Leave
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
