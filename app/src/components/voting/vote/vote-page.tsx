"use client";

import { useGetAuth } from "@/hooks/auth/use-auth";
import { useGetVotingById } from "@/hooks/votings/use-get-votings";
import { useSupabase } from "@/utils/supabase/client";
import React from "react";
import AddNewSession from "@/components/voting/session/add-new-session";
import { TChoice, TSession, TVoting } from "@/types/model";
import { useGetSession } from "@/hooks/sessions/use-session";
import Session from "@/components/voting/session/session";

type Props = {
  voting_id: string;
  initialData: {
    voting: TVoting;
    sessions: TSession[];
    choices: TChoice[];
  };
};

export default function VotePage({ voting_id, initialData }: Props) {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const { data: votingData } = useGetVotingById({
    id: voting_id,
    initialData: initialData.voting,
    supabase,
  });
  const { data: sessions } = useGetSession({
    initialData: initialData.sessions,
    supabase,
    voting_id,
  });

  const is_owner = React.useMemo(
    () => user?.id === votingData.user_id,
    [user?.id, votingData.user_id],
  );

  return (
    <div className="space-y-4 p-4 pt-0">
      {user?.id === votingData.user_id && (
        <div className="flex items-center justify-end gap-2">
          <AddNewSession data={votingData} />
        </div>
      )}

      <div className="space-y-2">
        {sessions.length === 0 ? (
          <div className="flex h-28 w-full items-center justify-center rounded-lg border text-sm text-muted-foreground">
            Session does not exist
          </div>
        ) : (
          sessions.map((d) => (
            <Session
              key={d.id}
              data={d}
              is_owner={is_owner}
              choices={initialData.choices}
            />
          ))
        )}
      </div>
    </div>
  );
}
