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
import {
  EllipsisVertical,
  ExternalLink,
  LogOut,
  SquareCheck,
  SquareX,
  Trash2,
} from "lucide-react";
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
import { useDeleteVoting } from "@/hooks/votings/use-modal-delete-voting";

type Props = {
  data: TVoting;
};

export default function VotingDropdown({ data }: Props) {
  const query = useQueryClient();
  const supabase = useSupabase();
  const { open: showDelete } = useDeleteVoting();
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

  const is_owner = React.useMemo(() => {
    return user?.id === data.user_id;
  }, [data.user_id, user?.id]);

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
              {data.is_open ? <SquareX /> : <SquareCheck />}
              {data.is_open ? "Close voting" : "Open voting"}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => openShare(data.id)}>
            <ExternalLink />
            Share
          </DropdownMenuItem>
          {!!isParticipant && (
            <DropdownMenuItem onClick={() => openLeave(true)}>
              <LogOut />
              Leave
            </DropdownMenuItem>
          )}
          {!isParticipant && !is_owner && data.is_open ? (
            <DropdownMenuItem
              onClick={() => joinSession({ voting_id: data.id })}
            >
              Join
            </DropdownMenuItem>
          ) : (
            ""
          )}
          {is_owner && (
            <DropdownMenuItem onClick={() => showDelete(data)}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
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
            {data.is_open ? <SquareX /> : <SquareCheck />}
            {data.is_open ? "Close voting" : "Open voting"}
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => openShare(data.id)}
        >
          <ExternalLink />
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
        {!isParticipant && !is_owner && data.is_open ? (
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

        {user?.id === data.user_id && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => showDelete(data)}
          >
            <Trash2 /> Delete
          </Button>
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
