"use client"

import { TParticipant, TVoting } from "@/types/model"
import React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  CirclePlus,
  EllipsisVertical,
  ExternalLink,
  LogOut,
  SquareCheck,
  SquareX,
  Trash2,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useSupabase } from "@/utils/supabase/client"
import { toast } from "sonner"
import ShareVoting from "./share/share-voting"
import { useGetAuth } from "@/hooks/auth/use-auth"
import LeaveParticipant from "./participants/leave-participant"
import { joinSession } from "@/actions/join-session"
import { revalidateVoting } from "@/app/(api)/api/voting/[voting_id]/get-voting-by-id-cached"
import DeleteVoting from "./delete-voting"

type Props = {
  data: TVoting
  participants: TParticipant[]
}

export default function VotingDropdown({ data, participants }: Props) {
  const query = useQueryClient()
  const supabase = useSupabase()
  const [shareDialog, setShareDialog] = React.useState(false)
  const [deleteDialog, setDeleteDialog] = React.useState(false)
  const [leaveDialog, setLeaveDialog] = React.useState(false)
  const { data: user } = useGetAuth(supabase)

  // Check if user is a participant
  const isParticipant = React.useMemo(() => {
    if (!user) return null

    return participants.find((p) => p.user_id === user.id)
  }, [participants, user])

  // Check if user is the owner
  const isOwner = React.useMemo(() => {
    if (!user) return false

    return data.user_id === user.id
  }, [data.user_id, user])

  const openCloseHandler = React.useCallback(
    async (state: boolean) => {
      const toastId = toast.loading("Loading...", { duration: Infinity })
      const { error } = await supabase
        .from("votings")
        .update({ is_open: state })
        .eq("id", data.id)
      toast.dismiss(toastId)

      if (error) {
        toast.error(`Failed to ${state ? "open" : "close"} voting`)
        return
      }

      toast.success(`Voting has been ${state ? "opened" : "closed"}`)
      query.setQueryData<TVoting>(["voting", data.id], (prev) =>
        prev ? { ...prev, is_open: state } : undefined,
      )
      await revalidateVoting(data.id)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.id],
  )

  const joinHandler = async () => {
    const formData = new FormData()
    formData.set("id", data.id)
    const { error, message } = await joinSession(formData)

    if (error) {
      toast.error(error)
      return
    }

    toast.success(message)
    window.location.reload()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="lg:hidden">
          <Button size="icon" variant="ghost">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" align="start">
          {data.user_id === user?.id && (
            <DropdownMenuItem onClick={() => openCloseHandler(!data.is_open)}>
              {data.is_open ? <SquareX /> : <SquareCheck />}
              {data.is_open ? "Close voting" : "Open voting"}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setShareDialog(true)}>
            <ExternalLink />
            Share
          </DropdownMenuItem>
          {!!isParticipant && (
            <DropdownMenuItem onClick={() => setLeaveDialog(true)}>
              <LogOut />
              Leave
            </DropdownMenuItem>
          )}
          {!isParticipant && !isOwner && data.is_open ? (
            <DropdownMenuItem onClick={joinHandler}>
              <CirclePlus />
              Join
            </DropdownMenuItem>
          ) : (
            ""
          )}
          {isOwner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeleteDialog(true)}>
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
          onClick={() => setShareDialog(true)}
        >
          <ExternalLink />
          Share
        </Button>
        {!!isParticipant && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setLeaveDialog(true)}
          >
            <LogOut />
            Leave
          </Button>
        )}
        {!isParticipant && !isOwner && data.is_open ? (
          <Button size="sm" variant="secondary" onClick={joinHandler}>
            <CirclePlus />
            Join
          </Button>
        ) : (
          ""
        )}

        {isOwner && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteDialog(true)}
          >
            <Trash2 /> Delete
          </Button>
        )}
      </div>

      <ShareVoting
        voting_id={data.id}
        open={shareDialog}
        onOpenChange={setShareDialog}
      />
      {isOwner && (
        <DeleteVoting
          voting_id={data.id}
          open={deleteDialog}
          onOpenChange={setDeleteDialog}
        />
      )}
      {isParticipant && (
        <LeaveParticipant
          open={leaveDialog}
          onOpenChange={setLeaveDialog}
          voting_id={data.id}
          id={isParticipant.id}
        />
      )}
    </>
  )
}
