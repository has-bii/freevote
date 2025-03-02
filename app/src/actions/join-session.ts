"use server";

import { revalidateParticipant } from "@/app/(api)/api/participant/[voting_id]/get-participant-cached";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

type Response = {
  error?: string;
  message?: string;
};

const formSchema = z.string().uuid("Invalid ID");

export const joinSession = async (formData: FormData): Promise<Response> => {
  const supabase = await createClient();

  const { data: voting_id, error: errorParsed } = formSchema.safeParse(
    formData.get("id"),
  );

  if (errorParsed) return { error: "Invalid Id" };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error, data } = await supabase
    .from("voters")
    .insert({ voting_id })
    .select("*,votings!inner(name)")
    .single();

  if (error) return { error: error.message };

  revalidateParticipant(voting_id);

  return {
    message: `Joined to ${data.votings.name} successfully`,
  };
};
