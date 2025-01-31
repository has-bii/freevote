import { getChoiceCached } from "@/app/(api)/api/choice/[voting_id]/get-choice-cached";
import { getParticipantCached } from "@/app/(api)/api/participant/[voting_id]/get-participant-cached";
import { getResultCached } from "@/app/(api)/api/result/[session_id]/get-result-cached";
import { getSessionCached } from "@/app/(api)/api/session/[voting_id]/get-session-cached";
import { getVotingByIdCached } from "@/app/(api)/api/voting/[voting_id]/get-voting-by-id-cached";
import ResultChart from "@/components/voting/result/result-chart";
import SelectSessions from "@/components/voting/result/select-sessions";
import React from "react";

type Props = {
  params: Promise<{
    session_id: string;
    voting_id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { session_id, voting_id } = await params;

  const [
    { data: result, error: errorResult },
    { data: sessions, error: errorSessions },
    { data: choices, error: errorChoices },
    { data: participants, error: errorParticipants },
    { data: voting, error: errorVoting },
  ] = await Promise.all([
    getResultCached(session_id),
    getSessionCached(voting_id),
    getChoiceCached(voting_id),
    getParticipantCached(voting_id),
    getVotingByIdCached(voting_id),
  ]);

  if (!result || !sessions || !choices || !participants || !voting)
    throw new Error(
      errorResult
        ? errorResult
        : errorSessions
          ? errorSessions
          : errorChoices
            ? errorChoices
            : errorParticipants
              ? errorParticipants
              : errorVoting
                ? errorVoting
                : "Unexpected error has occurred",
    );

  const filteredChoices = choices.filter((c) =>
    result.choices.some((r) => r === c.id),
  );

  return (
    <div className="space-y-4 p-4 pt-0">
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Voting Result</h2>

        {/* Select */}
        <SelectSessions
          voting_id={voting_id}
          data={sessions}
          current={session_id}
        />
      </div>

      {/* Contents */}
      <ResultChart
        data={result}
        session_id={session_id}
        choices={filteredChoices}
        participants={participants.length}
        owner_id={voting.user_id}
      />
    </div>
  );
}
