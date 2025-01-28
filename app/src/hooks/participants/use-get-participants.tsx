import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { actionGetParticipants } from "./action-get-participants";
import { TParticipant, TProfile } from "@/types/model";

type SelectedProfile = Pick<TProfile, "full_name" | "avatar">;

export type UseGetParticipantsParams = {
  id: string;
  initialData: Array<TParticipant & { profiles: SelectedProfile }>;
};

export const useGetParticipants = ({
  id,
  initialData,
}: UseGetParticipantsParams) =>
  useQuery({
    queryKey: ["participants", id],
    initialData,
    queryFn: async () => {
      const { data, error } = await actionGetParticipants(id);

      if (!data) {
        toast.error("Failed to get participants");
        throw new Error(error);
      }

      return data;
    },
  });
