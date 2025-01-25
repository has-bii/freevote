import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetSession = (supabase: TSupabaseClient, voting_id: string) =>
  useQuery({
    queryKey: ["session", voting_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("voting_id", voting_id);

      if (error) {
        toast.error("Failed to get sessions");
        throw new Error(error.message);
      }

      return data;
    },
  });
