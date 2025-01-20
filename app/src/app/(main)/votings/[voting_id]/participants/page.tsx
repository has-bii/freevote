import React from "react";
import Participants from "@/components/voting/participants/participants";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingParticipantsPage({ params }: Props) {
  const { voting_id } = await params;

  return <Participants id={voting_id} />;
}
