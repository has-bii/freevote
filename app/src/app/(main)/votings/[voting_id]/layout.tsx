import HeaderVoteRoot from "@/components/voting/header-vote/header-vote-root";
import Skeletonn from "@/components/voting/header-vote/skeletonn";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ voting_id: string }>;
};

export default function VotingLayout({ children, params }: Props) {
  return (
    <>
      <React.Suspense fallback={<Skeletonn />}>
        <HeaderVoteRoot params={params} />
      </React.Suspense>
      {children}
    </>
  );
}
