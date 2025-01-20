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

type Props = {
  id: string;
  owner_id: string;
};

export default function Participants({ id, owner_id }: Props) {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const { data: participants } = useGetParticipants(supabase, id);
  const [removeData, setRemoveData] = React.useState<
    TParticipantRemove | undefined
  >();

  const is_owner = React.useMemo(() => {
    if (!user) return false;

    return user.id === owner_id;
  }, [user, owner_id]);

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
                    <TableCell>{profiles.full_name}</TableCell>
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
