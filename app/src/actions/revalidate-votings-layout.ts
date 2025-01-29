"use server";

import { revalidatePath } from "next/cache";

export const revalidateVotingsLayout = async () => {
  revalidatePath("/votings", "layout");
};
