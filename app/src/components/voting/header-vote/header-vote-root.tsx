import { getParticipantCached } from "@/app/(api)/api/participant/[voting_id]/get-participant-cached";
import { getVotingByIdCached } from "@/app/(api)/api/voting/[voting_id]/get-voting-by-id-cached";
import { redirect } from "next/navigation";
import React from "react";
import HeaderVotePage from "./header-vote-page";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function HeaderVoteRoot({ params }: Props) {
  const { voting_id } = await params;

  const [{ data: voting, error: er1 }, { data: participants, error: er2 }] =
    await Promise.all([
      getVotingByIdCached(voting_id),
      getParticipantCached(voting_id),
    ]);

  if (er1 !== null || er2 !== null) redirect("/votings");

  return (
    <HeaderVotePage
      initialData={{ voting, participants }}
      voting_id={voting_id}
    />
  );
}
