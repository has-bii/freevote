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
import { useSupabase } from "@/utils/supabase/client";
import { useGetAuth } from "@/hooks/auth/use-auth";
import { TVoting } from "@/types/model";
import { useRouter } from "next/navigation";

interface Props extends UseGetParticipantsParams {
  id: string;
  votingData: TVoting | null;
}

export default function Participants({ id, initialData, votingData }: Props) {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const router = useRouter();
  const {
    data: participants,
    refetch,
    isRefetching,
  } = useGetParticipants({ id, initialData });

  React.useEffect(() => {
    if (!user || !votingData) return;

    if (user.id !== votingData.user_id) router.push(`/votings/${id}/vote`);
  }, [id, router, user, votingData]);

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
