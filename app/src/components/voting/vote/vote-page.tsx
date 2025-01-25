"use client";

import { useGetAuth } from "@/hooks/auth/use-auth";
import { useGetVotingById } from "@/hooks/votings/use-get-votings";
import { useSupabase } from "@/utils/supabase/client";
import { Loader } from "lucide-react";
import React from "react";
import AddNewSession from "@/components/voting/session/add-new-session";
import Sessions from "../session/sessions";

type Props = {
  voting_id: string;
};

export default function VotePage({ voting_id }: Props) {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const { data: votingData } = useGetVotingById(supabase, voting_id);

  if (user && votingData)
    return (
      <div className="space-y-4 p-4 pt-0">
        {user.id === votingData.user_id && (
          <div className="flex items-center justify-end gap-2">
            <AddNewSession data={votingData} />
          </div>
        )}

        <Sessions
          voting_id={voting_id}
          is_owner={user.id === votingData.user_id}
        />
      </div>
    );

  return (
    <div className="flex flex-1 items-center justify-center p-4 pt-0">
      <Loader className="size-44 animate-spin" />
    </div>
  );
}
