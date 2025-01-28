"use client";

import {
  useGetParticipants,
  UseGetParticipantsParams,
} from "@/hooks/participants/use-get-participants";
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";

interface Props extends UseGetParticipantsParams {
  id: string;
}

export default function Participants({ id, initialData }: Props) {
  const {
    data: participants,
    refetch,
    isRefetching,
  } = useGetParticipants({ id, initialData });

  return (
    <div className="space-y-2 p-4 pt-0">
      <div className="flex justify-end">
        <Button onClick={() => refetch()} disabled={isRefetching}>
          <RefreshCw className={isRefetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <DataTable columns={columns} data={participants} />
    </div>
  );
}
