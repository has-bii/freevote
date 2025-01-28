"use server";

import { revalidatePath } from "next/cache";

export const revalidateVote = async (id: string) => {
  revalidatePath(`/votings/${id}/vote`);
  revalidatePath(`/votings/${id}/choices`);
  revalidatePath(`/votings/${id}/participants`);
};
