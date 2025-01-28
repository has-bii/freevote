import HeaderVotePage from "@/components/voting/header-vote-page";
import React from "react";

export const fetchCache = "force-cache";
export const revalidate = 300;

type Props = {
  children: React.ReactNode;
  params: Promise<{ voting_id: string }>;
};

export default async function VotingLayout({ children, params }: Props) {
  const { voting_id } = await params;

  return (
    <>
      <HeaderVotePage id={voting_id} />
      {children}
    </>
  );
}
