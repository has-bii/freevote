import React from "react";
import Participants from "@/components/voting/participants/participants";
import { createClient } from "@/utils/supabase/server";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingParticipantsPage({ params }: Props) {
  const { voting_id } = await params;
  const supabase = await createClient();
  const {} = await supabase.auth.getUser();

  return <Participants id={voting_id} />;
}
