import VotePage from "@/components/voting/vote/vote-page";
import React from "react";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingServerPage({ params }: Props) {
  const { voting_id } = await params;

  return <VotePage voting_id={voting_id} />;
}
