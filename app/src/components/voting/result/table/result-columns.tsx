"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TChoice, TProfile, TVote } from "@/types/model";
import { ColumnDef } from "@tanstack/react-table";
import { compareAsc, format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

type TData = TVote & {
  choices: TChoice;
  profiles: Pick<TProfile, "avatar" | "full_name">;
};

export const resultColumns: ColumnDef<TData>[] = [
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
        <Avatar className="hidden h-7 w-7 md:flex">
          <AvatarImage src={profiles.avatar ?? undefined} />
          <AvatarFallback>
            {profiles.full_name
              .split(" ")
              .map((c) => c[0].toUpperCase())
              .join("")}
          </AvatarFallback>
        </Avatar>
        <p className="line-clamp-1 text-sm">{profiles.full_name}</p>
      </div>
    ),
  },
  {
    accessorKey: "choice_id",
    header: "Choice",
    cell: ({ row: { original } }) => (
      <p className="line-clamp-1 text-sm">{original.choices.name}</p>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
          Voted at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({
      row: {
        original: { created_at },
      },
    }) => (
      <p
        className="line-clamp-1 text-sm text-muted-foreground"
        title={format(created_at, "p PP")}
      >
        {format(created_at, "p PP")}
      </p>
    ),
  },
];
