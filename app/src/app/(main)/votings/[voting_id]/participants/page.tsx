import React from "react";
import VotingPage from "@/components/voting/voting-page";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Participants from "@/components/voting/participants/participants";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingParticipantsPage({ params }: Props) {
  const { voting_id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("votings")
    .select("*")
    .eq("id", voting_id)
    .single();

  if (error) redirect("/votings/not-found");

  return (
    <>
      <VotingPage data={data} />
      <Participants id={voting_id} owner_id={data.user_id} />
    </>
  );
}
