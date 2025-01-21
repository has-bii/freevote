"use client";

import { useGetAuth } from "@/hooks/auth/use-auth";
import { useGetChoices } from "@/hooks/choices/use-get-choices";
import { useGetVotingById } from "@/hooks/votings/use-get-votings";
import { useSupabase } from "@/utils/supabase/client";
import { Loader } from "lucide-react";
import React from "react";
import OwnerHandlers from "./owner-handlers";

type Props = {
  voting_id: string;
};

export default function VotePage({ voting_id }: Props) {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const { data: votingData } = useGetVotingById(supabase, voting_id);
  const { data: choices } = useGetChoices(supabase, voting_id);

  if (user && votingData && choices)
    return (
      <div className="p-4 pt-0">
        {user.id === votingData.user_id && (
          <div className="flex items-center justify-end gap-2">
            <OwnerHandlers choices={choices} data={votingData} />
          </div>
        )}
      </div>
    );

  return (
    <div className="flex flex-1 items-center justify-center p-4 pt-0">
      <Loader className="size-44 animate-spin" />
    </div>
  );
}
