import { Button } from "@/components/ui/button";
import { TVoting } from "@/types/model";
import { TSupabaseClient } from "@/utils/supabase/server";
import { QueryClient } from "@tanstack/react-query";
import { CirclePause, Loader } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  query: QueryClient;
  supabase: TSupabaseClient;
  id: string;
};

export default function StopSession({ id, query, supabase }: Props) {
  const [loading, setLoading] = React.useState(false);

  const stopHandler = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("votings")
      .update({ is_start: false, expired_session: null })
      .eq("id", id);
    setLoading(false);

    if (error) {
      toast.error("Failed to stop session");
      return;
    }

    query.setQueryData<TVoting>(["voting", id], (prev) =>
      prev ? { ...prev, is_start: false } : undefined,
    );
  };

  return (
    <Button variant="destructive" onClick={stopHandler} disabled={loading}>
      <CirclePause /> Stop session
      {loading && <Loader className="animate-spin" />}
    </Button>
  );
}
