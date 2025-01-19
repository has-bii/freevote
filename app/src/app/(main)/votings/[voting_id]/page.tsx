import React from "react";
import VotingPage from "./voting-page";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingServerPage({ params }: Props) {
  const { voting_id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("votings")
    .select("*")
    .eq("id", voting_id)
    .single();

  if (error) redirect("/votings/not-found");

  return <VotingPage data={data} />;
}
