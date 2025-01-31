import React from "react";
import { getVotingByIdCached } from "@/app/(api)/api/voting/[voting_id]/get-voting-by-id-cached";
import { getSessionCached } from "@/app/(api)/api/session/[voting_id]/get-session-cached";
import { getChoiceCached } from "@/app/(api)/api/choice/[voting_id]/get-choice-cached";
import { getParticipantCached } from "@/app/(api)/api/participant/[voting_id]/get-participant-cached";
import VotePage from "@/components/voting/vote/vote-page";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingServerPage({ params }: Props) {
  const { voting_id } = await params;

  const [
    { data: voting, error: error1 },
    { data: sessions, error: error2 },
    { data: choices, error: error3 },
    { data: participants, error: error4 },
  ] = await Promise.all([
    getVotingByIdCached(voting_id),
    getSessionCached(voting_id),
    getChoiceCached(voting_id),
    getParticipantCached(voting_id),
  ]);

  if (!voting || !sessions || !choices || participants === null)
    throw new Error(
      error1
        ? error1
        : error2
          ? error2
          : error3
            ? error3
            : error4 !== null
              ? error4
              : "Unexpected error has occurred.",
    );

  return (
    <VotePage
      voting_id={voting_id}
      initialData={{
        voting,
        sessions,
        choices,
        participants,
      }}
    />
  );
}
