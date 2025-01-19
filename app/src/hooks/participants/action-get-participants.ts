"use server";

import { createService } from "@/utils/supabase/service";

export const actionGetParticipants = async (id: string) => {
  const supabase = createService();

  const { data, error } = await supabase
    .from("voters")
    .select("*,profiles!inner(full_name,avatar)")
    .eq("voting_id", id);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
};
