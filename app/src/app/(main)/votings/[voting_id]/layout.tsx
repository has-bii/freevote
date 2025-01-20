import VotingPage from "@/components/voting/voting-page";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ voting_id: string }>;
};

export default async function VotingLayout({ children, params }: Props) {
  const { voting_id } = await params;

  return (
    <>
      <VotingPage voting_id={voting_id} />
      {children}
    </>
  );
}
