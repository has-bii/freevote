import { TSupabaseClient } from "@/utils/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { actionGetParticipants } from "./action-get-participants";

export const useGetParticipants = (supabase: TSupabaseClient, id: string) =>
  useQuery({
    queryKey: ["participants", id],
    queryFn: async () => {
      const { data, error } = await actionGetParticipants(id);

      if (!data) {
        toast.error("Failed to get participants");
        throw new Error(error);
      }

      return data;
    },
  });
