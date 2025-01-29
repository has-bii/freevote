import { TSession, TVote } from "@/types/model";
import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type Params = {
  supabase: TSupabaseClient;
  voting_id: string;
  initialData: (TSession & { votes: TVote[] })[];
};

export const useGetSession = ({ initialData, supabase, voting_id }: Params) =>
  useQuery({
    queryKey: ["session", voting_id],
    initialData,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*,votes(*)")
        .eq("voting_id", voting_id);

      if (error) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      return data;
    },
  });
