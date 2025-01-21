"use client";

import { TVoting } from "@/types/model";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useShareVoting } from "./share/use-share-voting";
import ShareVoting from "./share/share-voting";
import { useGetAuth } from "@/hooks/auth/use-auth";
import { useIsParticipant } from "@/hooks/participants/use-is-participant";
import LeaveParticipant from "./participants/leave-participant";
import { useModalLeave } from "@/hooks/use-modal-leave";
import { joinSession } from "@/actions/join-session";

type Props = {
  data: TVoting;
};

export default function VotingDropdown({ data }: Props) {
  const query = useQueryClient();
  const supabase = useSupabase();
  const { open: openShare } = useShareVoting();
  const { open: openLeave } = useModalLeave();
  const { data: user } = useGetAuth(supabase);
  const { data: isParticipant } = useIsParticipant(supabase, data.id);

  const openCloseHandler = async (state: boolean) => {
    const toastId = toast.loading("Loading...", { duration: Infinity });
    const { error, data: newData } = await supabase
      .from("votings")
      .update({ is_open: state })
      .eq("id", data.id)
      .select("*")
      .single();

    if (error) {
      toast.error(`Failed to ${state ? "open" : "close"} voting`);
      console.log(error);
    } else {
      toast.success(`Voting has been ${state ? "opened" : "closed"}`);
      query.setQueryData<TVoting>(["voting", data.id], () => newData);
    }

    toast.dismiss(toastId);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="lg:hidden">
          <Button size="icon" variant="ghost">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {data.user_id === user?.id && (
            <DropdownMenuItem onClick={() => openCloseHandler(!data.is_open)}>
              {data.is_open ? "Close voting" : "Open voting"}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => openShare(data.id)}>
            Share session
          </DropdownMenuItem>
          {!!isParticipant && (
            <DropdownMenuItem onClick={() => openLeave(true)}>
              Leave
            </DropdownMenuItem>
          )}
          {!isParticipant && user?.id !== data.user_id && data.is_open ? (
            <DropdownMenuItem
              onClick={() => joinSession({ voting_id: data.id })}
            >
              Join
            </DropdownMenuItem>
          ) : (
            ""
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="hidden items-center gap-2 lg:flex">
        {data.user_id === user?.id && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => openCloseHandler(!data.is_open)}
          >
            {data.is_open ? "Close voting" : "Open voting"}
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => openShare(data.id)}
        >
          Share
        </Button>
        {!!isParticipant && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => openLeave(true)}
          >
            Leave
          </Button>
        )}
        {!isParticipant && user?.id !== data.user_id && data.is_open ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => joinSession({ voting_id: data.id })}
          >
            Join
          </Button>
        ) : (
          ""
        )}
      </div>

      <ShareVoting />
      {isParticipant && (
        <LeaveParticipant
          data={isParticipant}
          query={query}
          supabase={supabase}
        />
      )}
    </>
  );
}
