import React from "react";
import ChoicesPage from "@/components/voting/choices/choices-page";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingServerPage({ params }: Props) {
  const { voting_id } = await params;

  return <ChoicesPage voting_id={voting_id} />;
}
