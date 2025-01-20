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
import { useSupabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Loader, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { TChoice } from "@/types/model";

type Props = {
  children: React.ReactNode;
  data: TChoice;
};

export default function RemoveChoice({ children, data }: Props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const supabase = useSupabase();
  const query = useQueryClient();

  const deleteHandler = async () => {
    setLoading(true);
    const { error } = await supabase.from("choices").delete().eq("id", data.id);
    setLoading(false);
    if (error) {
      toast.error("Failed to delete the choice");
      return;
    }

    query.invalidateQueries({ queryKey: ["choices", data.voting_id] });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Choice</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this choice? This action cannot be
            undone, and all associated votes will be removed permanently.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={deleteHandler}
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : <Trash2 />}Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
