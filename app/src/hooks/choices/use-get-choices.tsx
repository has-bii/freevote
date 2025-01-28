import { TChoice } from "@/types/model";
import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type UseGetChoices = {
  supabase: TSupabaseClient;
  voting_id: string;
  initialData?: TChoice[];
};

export const useGetChoices = ({
  initialData,
  supabase,
  voting_id,
}: UseGetChoices) =>
  useQuery({
    queryKey: ["choices", voting_id],
    initialData,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("choices")
        .select("*")
        .eq("voting_id", voting_id);

      if (error) {
        toast.error("Failed to get choices");
        throw new Error("Failed to get choices");
      }

      return data;
    },
  });

export const useGetChoicesIn = (supabase: TSupabaseClient, choices: string[]) =>
  useQuery({
    queryKey: ["choices", choices],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("choices")
        .select("*")
        .in("id", choices);

      if (error) {
        toast.error("Failed to get choices");
        throw new Error("Failed to get choices");
      }

      return data;
    },
  });
