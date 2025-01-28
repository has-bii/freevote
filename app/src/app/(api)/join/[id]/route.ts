"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const voting_id = (await params).id;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase.from("voters").insert({ voting_id });

  if (error) {
    redirect(`/votings/${voting_id}/vote?error=${error.message}`);
  }

  revalidatePath(`/votings/${voting_id}/vote`);
  revalidatePath(`/votings/${voting_id}/choices`);
  revalidatePath(`/votings/${voting_id}/participants`);
  redirect("/votings");
}
