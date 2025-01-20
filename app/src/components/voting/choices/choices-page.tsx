"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetAuth } from "@/hooks/auth/use-auth";
import { useGetChoices } from "@/hooks/choices/use-get-choices";
import { TVoting } from "@/types/model";
import { useSupabase } from "@/utils/supabase/client";
import React from "react";
import AddChoice from "./add-choice";
import Choice from "./choice";

type Props = {
  data: TVoting;
};

export default function ChoicesPage({ data }: Props) {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const { data: choices } = useGetChoices(supabase, data.id);

  return (
    <div className="space-y-4 p-4 pt-0">
      {user?.id === data.user_id && (
        <div className="flex justify-end">
          <AddChoice id={data.id} />
        </div>
      )}
      <div className="flex flex-col gap-4">
        {choices === undefined ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))
        ) : choices.length === 0 ? (
          <div className="flex h-28 w-full items-center justify-center rounded-lg border">
            <p className="text-muted-foreground">
              There is no choice available
            </p>
          </div>
        ) : (
          choices.map((choice) => (
            <Choice
              key={choice.id}
              data={choice}
              isOwner={user?.id === data.user_id}
            />
          ))
        )}
      </div>
    </div>
  );
}
