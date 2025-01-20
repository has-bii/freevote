"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type Params = {
  voting_id: string;
};

export const joinSession = async ({ voting_id }: Params) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase.from("voters").insert({ voting_id });

  if (error) {
    redirect(`/votings/${voting_id}/vote?error=${error.message}`);
  }

  redirect(`/votings/${voting_id}/vote`);
};
