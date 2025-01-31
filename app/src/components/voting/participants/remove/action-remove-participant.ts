"use server";

import { revalidateParticipant } from "@/app/(api)/api/participant/[voting_id]/get-participant-cached";
import { revalidateResultByVotingId } from "@/app/(api)/api/result/[session_id]/get-result-cached";
import { createService } from "@/utils/supabase/service";

type Params = {
  id: number;
};

export const actionRemoveParticipant = async ({ id }: Params) => {
  const supabase = createService();

  const { error, data } = await supabase
    .from("voters")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  await revalidateParticipant(data.voting_id);
  await revalidateResultByVotingId(data.voting_id);

  return {
    success: true,
    message: "Participant has been removed successfully",
  };
};
