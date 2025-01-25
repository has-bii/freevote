"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetSession } from "@/hooks/sessions/use-session";
import { useSupabase } from "@/utils/supabase/client";
import React from "react";
import Session from "./session";

type Props = {
  voting_id: string;
  is_owner: boolean;
};

export default function Sessions({ voting_id, is_owner }: Props) {
  const supabase = useSupabase();
  const { data, isLoading, isRefetching, error } = useGetSession(
    supabase,
    voting_id,
  );

  if (data)
    return (
      <div className="space-y-2">
        {data.length === 0 ? (
          <div className="flex h-28 w-full items-center justify-center rounded-lg border text-sm text-muted-foreground">
            Session does not exist
          </div>
        ) : (
          data.map((d) => <Session key={d.id} data={d} is_owner={is_owner} />)
        )}
      </div>
    );

  if (error)
    return (
      <div className="flex h-28 items-center justify-center rounded-lg border border-red-400 bg-red-50 text-sm text-red-500">
        {error.message}
      </div>
    );

  if (isLoading || isRefetching)
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
}
