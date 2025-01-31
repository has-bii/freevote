"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";
import { useSupabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { revalidateResult } from "@/app/(api)/api/result/[session_id]/get-result-cached";

type Props = {
  session_id: string;
  choice_id: string;
  voting_id: string;
  children: React.ReactNode;
  closeModal: () => void;
};

export default function GiveVoteConfirm(props: Props) {
  const { session_id, children, choice_id, voting_id, closeModal } = props;
  const supabase = useSupabase();
  const query = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handler = async () => {
    setLoading(true);
    const { error } = await supabase.from("votes").insert({
      choice_id,
      session_id,
      voting_id,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    await revalidateResult(session_id);
    setLoading(false);
    toast.success("Your vote has been recorded successfully!");
    query.invalidateQueries({
      queryKey: ["has voted", session_id],
    });
    setOpen(false);
    closeModal();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={loading} onClick={handler}>
            {loading && <Loader className="animate-spin" />}
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
