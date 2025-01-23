"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteVoting } from "../../hooks/votings/use-modal-delete-voting";
import { useSupabase } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteVoting() {
  const { data, close } = useDeleteVoting();
  const [loading, setLoading] = React.useState<boolean>(false);
  const supabase = useSupabase();
  const query = useQueryClient();
  const router = useRouter();

  const deleteHandler = React.useCallback(async () => {
    if (!data) return;

    setLoading(true);

    const { error } = await supabase.from("votings").delete().eq("id", data.id);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    close();
    query.invalidateQueries({ queryKey: ["votings"] });
    router.push("/votings");
  }, [close, data, query, router, supabase]);

  return (
    <Dialog open={data !== null} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete voting
            data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={close} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={deleteHandler}
            disabled={loading}
          >
            Delete {loading ? <Loader className="animate-spin" /> : <Trash />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
