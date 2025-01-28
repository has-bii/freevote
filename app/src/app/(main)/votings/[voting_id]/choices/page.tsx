import React from "react";
import ChoicesPage from "@/components/voting/choices/choices-page";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const fetchCache = "force-cache";
export const revalidate = 300;

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingServerPage({ params }: Props) {
  const { voting_id } = await params;
  const supabase = await createClient();

  const fetchVotingData = supabase
    .from("votings")
    .select("*")
    .eq("id", voting_id)
    .single();
  const fetchChoicesData = supabase
    .from("choices")
    .select("*")
    .eq("voting_id", voting_id);
  const fetchUser = supabase.auth.getUser();

  const [
    { data: votingData },
    { data: choicesData },
    {
      data: { user },
    },
  ] = await Promise.all([fetchVotingData, fetchChoicesData, fetchUser]);

  if (!votingData || choicesData === null) redirect("/votings");

  return (
    <ChoicesPage
      voting_id={voting_id}
      initialData={{
        choicesData,
        votingData,
      }}
      user={user!}
    />
  );
}
