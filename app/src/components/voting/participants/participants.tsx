"use client";

import { useGetParticipants } from "@/hooks/participants/use-get-participants";
import { useSupabase } from "@/utils/supabase/client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAuth } from "@/hooks/auth/use-auth";
import { Button } from "@/components/ui/button";
import RemoveParticipant, {
  TParticipantRemove,
} from "./remove/remove-participant";
import { useGetVotingById } from "@/hooks/votings/use-get-votings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  id: string;
};

export default function Participants({ id }: Props) {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const { data: votingData } = useGetVotingById(supabase, id);
  const { data: participants } = useGetParticipants(supabase, id);
  const [removeData, setRemoveData] = React.useState<
    TParticipantRemove | undefined
  >();

  const is_owner = React.useMemo(() => {
    if (!user || !votingData) return false;

    return user.id === votingData?.user_id;
  }, [user, votingData]);

  return (
    <div className="p-4 pt-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Joined At</TableHead>
            {is_owner && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants === undefined
            ? Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : participants.map((participant, i) => {
                const { id, profiles, created_at } = participant;

                return (
                  <TableRow key={id}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={profiles.avatar ?? undefined} />
                          <AvatarFallback>
                            {profiles.full_name
                              .split(" ")
                              .map((c) => c[0].toUpperCase())
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p>{profiles.full_name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {format(created_at, "PP p")}
                    </TableCell>
                    {is_owner && (
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setRemoveData(participant)}
                          >
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>

      <RemoveParticipant
        open={removeData !== undefined}
        close={() => setRemoveData(undefined)}
        data={removeData}
      />
    </div>
  );
}
