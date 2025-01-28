"use server";

import { revalidatePath } from "next/cache";

export const revalidateChoice = async (voting_id: string) => {
  revalidatePath(`/votings/${voting_id}/choices`);
};
