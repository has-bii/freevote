"use client";

import { Button } from "@/components/ui/button";
import { TChoice, TVoting } from "@/types/model";
import { useSupabase } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import StartSession from "./start-session";
import StopSession from "./stop-session";

type Props = {
  data: TVoting;
  choices: TChoice[];
};

export default function OwnerHandlers({ choices, data }: Props) {
  const supabase = useSupabase();
  const query = useQueryClient();

  return (
    <>
      {data.is_start ? (
        <StopSession query={query} supabase={supabase} id={data.id} />
      ) : choices.length === 0 ? (
        <Button disabled>No choice exists</Button>
      ) : (
        <StartSession data={data} supabase={supabase} query={query} />
      )}
    </>
  );
}
