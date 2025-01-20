"use server";

import { createService } from "@/utils/supabase/service";

type Params = {
  id: number;
};

export const actionRemoveParticipant = async ({ id }: Params) => {
  const supabase = createService();

  const { error } = await supabase.from("voters").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "Participant has been removed successfully",
  };
};
