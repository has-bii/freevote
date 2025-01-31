import VotePage from "@/components/voting/vote/vote-page";
import { actionGetParticipants } from "@/hooks/participants/action-get-participants";
import { createClient } from "@/utils/supabase/server";
import React from "react";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingServerPage({ params }: Props) {
  const { voting_id } = await params;
  const supabase = await createClient();

  // Fetch voting data
  const fetchVotingData = supabase
    .from("votings")
    .select("*")
    .eq("id", voting_id)
    .single();

  // Fetch Sessions
  const fetchSessions = supabase
    .from("sessions")
    .select("*,votes(*)")
    .eq("voting_id", voting_id);

  // Fetch choices
  const fetchChoices = supabase
    .from("choices")
    .select("*")
    .eq("voting_id", voting_id);

  const [
    { data: voting, error: error1 },
    { data: sessions, error: error2 },
    { data: choices, error: error3 },
    { data: participants, error: error4 },
  ] = await Promise.all([
    fetchVotingData,
    fetchSessions,
    fetchChoices,
    actionGetParticipants(voting_id),
  ]);

  if (error1 || error2 || error3 || participants === null) {
    return (
      <div className="p-4 pt-0">
        <div className="flex h-28 w-full items-center justify-center rounded-lg border text-sm text-muted-foreground">
          {error1
            ? error1.message
            : error2
              ? error2.message
              : error3
                ? error3.message
                : error4 !== null
                  ? error4
                  : "Unexpected error has occurred."}
        </div>
      </div>
    );
  }

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
