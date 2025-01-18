import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetVotings = (supabase: TSupabaseClient) =>
  useQuery({
    queryKey: ["votings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("votings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      return data;
    },
  });
