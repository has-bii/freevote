"use server";

import { revalidatePath } from "next/cache";

export const revalidateVote = async () => {
  revalidatePath("/(main)/votings/[voting_id]", "layout");
};
