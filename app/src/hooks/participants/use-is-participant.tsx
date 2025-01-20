import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";

export const useIsParticipant = (
  supabase: TSupabaseClient,
  voting_id: string,
) =>
  useQuery({
    queryKey: ["is participant", voting_id],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data } = await supabase
        .from("voters")
        .select("*")
        .eq("user_id", user.id)
        .eq("voting_id", voting_id)
        .single();

      if (data) return data;

      return null;
    },
  });
