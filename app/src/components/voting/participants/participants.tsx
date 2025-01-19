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

type Props = {
  id: string;
};

export default function Participants({ id }: Props) {
  const supabase = useSupabase();
  const { data: participants } = useGetParticipants(supabase, id);

  return (
    <div className="p-4 pt-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Joined At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants === undefined
            ? Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={3}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : participants.map(({ id, profiles, created_at }, i) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell>{profiles.full_name}</TableCell>
                  <TableCell className="text-right">
                    {format(created_at, "PP p")}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
