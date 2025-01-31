import React from "react";
import Participants from "@/components/voting/participants/participants";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getVotingByIdCached } from "@/app/(api)/api/voting/[voting_id]/get-voting-by-id-cached";
import { getParticipantCached } from "@/app/(api)/api/participant/[voting_id]/get-participant-cached";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingParticipantsPage({ params }: Props) {
  const { voting_id } = await params;
  const supabase = await createClient();

  const { data } = await getVotingByIdCached(voting_id);

  if (!data) redirect("/votings");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (user.id !== data.user_id) redirect(`/votings/${voting_id}/vote`);

  const { data: participantsData } = await getParticipantCached(voting_id);

  return <Participants id={voting_id} initialData={participantsData ?? []} />;
}
