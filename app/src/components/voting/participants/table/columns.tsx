"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TParticipant, TProfile } from "@/types/model";
import { ColumnDef } from "@tanstack/react-table";
import { compareAsc, format } from "date-fns";
import { ArrowUpDown, Trash2 } from "lucide-react";
import RemoveParticipant from "../remove/remove-participant";

type TData = TParticipant & {
  profiles: Pick<TProfile, "full_name" | "avatar">;
};

export const columns: ColumnDef<TData>[] = [
  {
    accessorKey: "profiles",
    sortingFn: (
      { original: { profiles: profiles1 } },
      { original: { profiles: profiles2 } },
    ) => profiles1.full_name.localeCompare(profiles2.full_name),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({
      row: {
        original: { profiles },
      },
    }) => (
      <div className="ml-4 inline-flex items-center gap-2">
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
    ),
  },
  {
    accessorKey: "created_at",
    sortingFn: (
      { original: { created_at } },
      { original: { created_at: created_at2 } },
    ) => compareAsc(created_at, created_at2),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({
      row: {
        original: { created_at },
      },
    }) => (
      <span className="text-sm text-muted-foreground">
        {format(created_at, "PP p")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => (
      <div className="flex justify-end pr-2">
        <RemoveParticipant data={original}>
          <Button size="sm" variant="destructive">
            <Trash2 />
            Remove
          </Button>
        </RemoveParticipant>
      </div>
    ),
  },
];
