import React from "react";
import ChoicesPage from "@/components/voting/choices/choices-page";
import { redirect } from "next/navigation";
import { getVotingByIdCached } from "@/app/(api)/api/voting/[voting_id]/get-voting-by-id-cached";
import { getChoiceCached } from "@/app/(api)/api/choice/[voting_id]/get-choice-cached";

export const fetchCache = "force-cache";
export const revalidate = 300;

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function VotingServerPage({ params }: Props) {
  const { voting_id } = await params;

  const fetchVotingData = getVotingByIdCached(voting_id);

  const fetchChoicesData = getChoiceCached(voting_id);

  const [{ data: votingData }, { data: choicesData }] = await Promise.all([
    fetchVotingData,
    fetchChoicesData,
  ]);

  if (!votingData || choicesData === null) redirect("/votings");

  return (
    <ChoicesPage
      voting_id={voting_id}
      initialData={{
        choicesData,
        votingData,
      }}
    />
  );
}
