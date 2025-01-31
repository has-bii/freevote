import HeaderVotePage from "@/components/voting/header-vote/header-vote-page";
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
        <HeaderVotePage params={params} />
      </React.Suspense>
      {children}
    </>
  );
}
