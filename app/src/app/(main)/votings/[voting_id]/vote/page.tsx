import VotePage from "@/components/voting/vote/vote-page";
import { createClient } from "@/utils/supabase/server";
import React from "react";

export const fetchCache = "force-cache";
export const revalidate = 300;

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
    .select("*")
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
  ] = await Promise.all([fetchVotingData, fetchSessions, fetchChoices]);

  if (error1 || error2 || error3) return <p>Internal Server Error</p>;

  return (
    <VotePage
      voting_id={voting_id}
      initialData={{
        voting,
        sessions,
        choices,
      }}
    />
  );
}
