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
import { TSupabaseClient } from "@/utils/supabase/server";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  children: React.ReactNode;
  id: string;
  supabase: TSupabaseClient;
  query: QueryClient;
};

export default function DeleteSession({
  children,
  id,
  supabase,
  query,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onDeleteHandler = async () => {
    setLoading(true);
    const { error, data } = await supabase
      .from("sessions")
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    setLoading(false);

    if (error) {
      toast.error("Failed to delete session");
      return;
    }

    query.invalidateQueries({ queryKey: ["session", data.voting_id] });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
          <Button variant="destructive" onClick={onDeleteHandler}>
            {loading ? <Loader className="animate-spin" /> : <Trash2 />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
