"use client";

import { TParticipant, TVoting } from "@/types/model";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CirclePlus,
  EllipsisVertical,
  ExternalLink,
  Loader,
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
import LeaveParticipant from "./participants/leave-participant";
import { useModalLeave } from "@/hooks/use-modal-leave";
import { joinSession } from "@/actions/join-session";
import { useDeleteVoting } from "@/hooks/votings/use-modal-delete-voting";
import { revalidateVoting } from "@/app/(api)/api/voting/[voting_id]/get-voting-by-id-cached";
import DeleteVoting from "./delete-voting";

type Props = {
  data: TVoting;
  participants: TParticipant[];
};

export default function VotingDropdown({ data, participants }: Props) {
  const query = useQueryClient();
  const supabase = useSupabase();
  const { open: showDelete } = useDeleteVoting();
  const { open: openShare } = useShareVoting();
  const { open: openLeave } = useModalLeave();
  const { data: user } = useGetAuth(supabase);
  const [loadingJoin, setLoadJoin] = React.useState(false);

  // Check if user is a participant
  const isParticipant = React.useMemo(() => {
    if (!user) return false;

    return participants.find((p) => p.user_id === user.id);
  }, [participants, user]);

  // Check if user is the owner
  const isOwner = React.useMemo(() => {
    if (!user) return false;

    return data.user_id === user.id;
  }, [data.user_id, user]);

  const openCloseHandler = React.useCallback(
    async (state: boolean) => {
      const toastId = toast.loading("Loading...", { duration: Infinity });
      const { error } = await supabase
        .from("votings")
        .update({ is_open: state })
        .eq("id", data.id);

      if (error) {
        toast.error(`Failed to ${state ? "open" : "close"} voting`);
        console.log(error);
      } else {
        toast.success(`Voting has been ${state ? "opened" : "closed"}`);
        query.setQueryData<TVoting>(["voting", data.id], (prev) =>
          prev ? { ...prev, is_open: state } : undefined,
        );
        await revalidateVoting(data.id);
      }

      toast.dismiss(toastId);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.id],
  );

  const joinHandler = async () => {
    const formData = new FormData();
    formData.set("id", data.id);
    setLoadJoin(true);
    const { error, message } = await joinSession(formData);
    setLoadJoin(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success(message);
    window.location.reload();
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
          {!isParticipant && !isOwner && data.is_open ? (
            <DropdownMenuItem onClick={joinHandler} disabled={loadingJoin}>
              {loadingJoin ? (
                <Loader className="animate-spin" />
              ) : (
                <CirclePlus />
              )}
              Join
            </DropdownMenuItem>
          ) : (
            ""
          )}
          {isOwner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => showDelete(data)}>
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </>
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
            <LogOut />
            Leave
          </Button>
        )}
        {!isParticipant && !isOwner && data.is_open ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={joinHandler}
            disabled={loadingJoin}
          >
            {loadingJoin ? <Loader className="animate-spin" /> : <CirclePlus />}
            Join
          </Button>
        ) : (
          ""
        )}

        {isOwner && (
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
      <DeleteVoting />
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
