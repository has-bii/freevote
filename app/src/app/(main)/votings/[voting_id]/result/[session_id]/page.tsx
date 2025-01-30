import ResultChart from "@/components/voting/result/result-chart";
import SelectSessions from "@/components/voting/result/select-sessions";
import { actionGetParticipants } from "@/hooks/participants/action-get-participants";
import { createClient } from "@/utils/supabase/server";
import React from "react";

type Props = {
  params: Promise<{
    session_id: string;
    voting_id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { session_id, voting_id } = await params;
  const supabase = await createClient();

  // Fetch session data with votes
  const fetchResult = supabase
    .from("sessions")
    .select("*,votes(*,choices(*),profiles(full_name,avatar))")
    .eq("id", session_id)
    .single();

  // Fetch sessions
  const fetchSessions = supabase
    .from("sessions")
    .select("*")
    .eq("voting_id", voting_id);

  // Fetch choices
  const fetchChoices = supabase
    .from("choices")
    .select("*")
    .eq("voting_id", voting_id);

  // Fetch participants
  const fetchParticipants = actionGetParticipants(voting_id);

  // Fetch user
  const fetchUser = supabase.auth.getUser();

  // Fetch voting data
  const fetchVoting = supabase
    .from("votings")
    .select("user_id")
    .eq("id", voting_id)
    .single();

  const [
    { data: result, error: errorResult },
    { data: sessions, error: errorSessions },
    { data: choices, error: errorChoices },
    { data: participants, error: errorParticipants },
    {
      data: { user },
    },
    { data: voting },
  ] = await Promise.all([
    fetchResult,
    fetchSessions,
    fetchChoices,
    fetchParticipants,
    fetchUser,
    fetchVoting,
  ]);

  if (
    errorResult ||
    errorSessions ||
    errorChoices ||
    errorParticipants ||
    participants === null
  )
    // If error
    return (
      <div className="p-4 pt-0">
        <div className="flex h-28 w-full items-center justify-center rounded-xl border">
          <p className="text-center text-sm text-muted-foreground">
            {errorResult
              ? errorResult.message
              : errorSessions
                ? errorSessions.message
                : errorChoices
                  ? errorChoices.message
                  : errorParticipants
                    ? errorParticipants
                    : "Unexpected error has occurred"}
          </p>
        </div>
      </div>
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
        isAdmin={user?.id === voting?.user_id}
      />
    </div>
  );
}
