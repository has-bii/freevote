import { TChoice, TProfile, TSession, TVote } from "@/types/model";
import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";

type TData = TSession & {
  votes: (TVote & {
    choices: TChoice;
    profiles: Pick<TProfile, "avatar" | "full_name">;
  })[];
};

type Props = {
  supabase: TSupabaseClient;
  session_id: string;
  initialData: TData;
};

export const useGetResult = ({ session_id, supabase, initialData }: Props) =>
  useQuery({
    initialData,
    queryKey: ["result", session_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*,votes(*,choices(*),profiles(avatar,full_name))")
        .eq("id", session_id)
        .single();

      if (error) throw error;

      return data;
    },
  });
