import { TVoting } from "@/types/model";
import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetVotings = (
  supabase: TSupabaseClient,
  initialData?: TVoting[],
) =>
  useQuery({
    queryKey: ["votings"],
    initialData,
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Log in first");
        throw new Error("User is not authenticated");
      }

      const { data, error } = await supabase
        .from("votings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      return data;
    },
  });

type UseGetVotingByIdParams = {
  supabase: TSupabaseClient;
  id: string;
  initialData: TVoting;
};

export const useGetVotingById = ({
  id,
  initialData,
  supabase,
}: UseGetVotingByIdParams) =>
  useQuery({
    queryKey: ["voting", id],
    initialData,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("votings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      return data;
    },
  });

export const useGetJoinedVotings = (supabase: TSupabaseClient) =>
  useQuery({
    queryKey: ["joined votings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("voters")
        .select("*,votings(*)")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      return data.map((d) => d.votings);
    },
  });
