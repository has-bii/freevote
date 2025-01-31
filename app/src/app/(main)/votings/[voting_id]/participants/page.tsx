import React from "react";
import Participants from "@/components/voting/participants/participants";
import { getParticipantCached } from "@/app/(api)/api/participant/[voting_id]/get-participant-cached";
import { getVotingByIdCached } from "@/app/(api)/api/voting/[voting_id]/get-voting-by-id-cached";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingParticipantsPage({ params }: Props) {
  const { voting_id } = await params;

  const { data: participantsData } = await getParticipantCached(voting_id);
  const { data: votingData } = await getVotingByIdCached(voting_id);

  return (
    <Participants
      id={voting_id}
      initialData={participantsData ?? []}
      votingData={votingData}
    />
  );
}
