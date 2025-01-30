import { TChoice, TSession, TVote } from "@/types/model";
import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";

type TData = TSession & {
  votes: (TVote & {
    choices: TChoice;
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
        .select("*,votes(*,choices(*))")
        .eq("id", session_id)
        .single();

      if (error) throw error;

      return data;
    },
  });
