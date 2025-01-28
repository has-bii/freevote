"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetChoices } from "@/hooks/choices/use-get-choices";
import { useSupabase } from "@/utils/supabase/client";
import React from "react";
import AddChoice from "./add-choice";
import Choice from "./choice";
import { useGetVotingById } from "@/hooks/votings/use-get-votings";
import { TChoice, TVoting } from "@/types/model";
import { User } from "@supabase/supabase-js";

type Props = {
  voting_id: string;
  initialData: {
    votingData: TVoting;
    choicesData: TChoice[];
  };
  user: User;
};

export default function ChoicesPage({ voting_id, initialData, user }: Props) {
  const supabase = useSupabase();
  const { data: choices } = useGetChoices({
    initialData: initialData.choicesData,
    supabase,
    voting_id,
  });
  const { data: votingData } = useGetVotingById({
    id: voting_id,
    supabase,
    initialData: initialData.votingData,
  });

  const isOwner = user.id === votingData.user_id;

  return (
    <div className="space-y-4 p-4 pt-0">
      {votingData && user && votingData.user_id === user.id ? (
        <div className="flex justify-end">
          <AddChoice id={votingData.id} />
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col gap-4">
        {choices === undefined ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))
        ) : choices.length === 0 ? (
          <div className="flex h-28 w-full items-center justify-center rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Choice does not exist
            </p>
          </div>
        ) : (
          choices.map((choice) => (
            <Choice key={choice.id} data={choice} isOwner={isOwner} />
          ))
        )}
      </div>
    </div>
  );
}
