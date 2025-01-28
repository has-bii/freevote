"use client";

import {
  useGetParticipants,
  UseGetParticipantsParams,
} from "@/hooks/participants/use-get-participants";
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
import { Button } from "@/components/ui/button";
import RemoveParticipant, {
  TParticipantRemove,
} from "./remove/remove-participant";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RefreshCw, Trash2 } from "lucide-react";

interface Props extends UseGetParticipantsParams {
  id: string;
}

export default function Participants({ id, initialData }: Props) {
  const {
    data: participants,
    refetch,
    isRefetching,
  } = useGetParticipants({ id, initialData });
  const [removeData, setRemoveData] = React.useState<
    TParticipantRemove | undefined
  >();

  return (
    <div className="space-y-2 p-4 pt-0">
      <div className="flex justify-end">
        <Button onClick={() => refetch()} disabled={isRefetching}>
          <RefreshCw className={isRefetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Joined At</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants === undefined ? (
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={4}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : participants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>
                <div className="flex h-28 w-full items-center justify-center">
                  <p className="text-muted-foreground">No participant exists</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            participants.map((participant, i) => {
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
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setRemoveData(participant)}
                      >
                        <Trash2 />
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
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
