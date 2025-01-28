import React from "react";
import Participants from "@/components/voting/participants/participants";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { actionGetParticipants } from "@/hooks/participants/action-get-participants";

export const fetchCache = "force-cache";
export const revalidate = 300;

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingParticipantsPage({ params }: Props) {
  const { voting_id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("votings")
    .select("*")
    .eq("id", voting_id)
    .single();

  if (!data) redirect("/votings");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (user.id !== data.user_id) redirect(`/votings/${voting_id}/vote`);

  const { data: participantsData } = await actionGetParticipants(voting_id);

  return <Participants id={voting_id} initialData={participantsData ?? []} />;
}
