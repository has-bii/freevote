import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetChoices = (supabase: TSupabaseClient, voting_id: string) =>
  useQuery({
    queryKey: ["choices", voting_id],
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
