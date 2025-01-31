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
import { Button } from "@/components/ui/button";
import { Loader, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSupabase } from "@/utils/supabase/client";
import { revalidateSession } from "@/app/(api)/api/session/[voting_id]/get-session-cached";
import { TSession } from "@/types/model";

type Props = {
  data: TSession;
};

const DeleteSession = React.memo(function DeleteSession({
  data: { id, voting_id },
}: Props) {
  const supabase = useSupabase();
  const query = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onDeleteHandler = async () => {
    setLoading(true);
    const { error } = await supabase.from("sessions").delete().eq("id", id);

    if (error) {
      setLoading(false);
      toast.error("Failed to delete session");
      return;
    }

    await revalidateSession(voting_id);
    query.invalidateQueries({ queryKey: ["session", voting_id] });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Trash2 />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDeleteHandler}
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : <Trash2 />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default DeleteSession;
