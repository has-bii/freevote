"use client"

import React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { revalidateParticipant } from "@/app/(api)/api/participant/[voting_id]/get-participant-cached"
import { revalidateResultByVotingId } from "@/app/(api)/api/result/[session_id]/get-result-cached"
import { useSupabase } from "@/utils/supabase/client"

interface LeaveParticipantProps extends React.ComponentProps<typeof Dialog> {
  id: number
  voting_id: string
}

export default function LeaveParticipant({
  id,
  voting_id,
  ...props
}: LeaveParticipantProps) {
  const supabase = useSupabase()

  const leaveHandler = async () => {
    const toast_id = toast.loading("Leaving voting...", {
      duration: Infinity,
    })
    const { error } = await supabase.from("voters").delete().eq("id", id)
    toast.dismiss(toast_id)

    if (error) {
      toast.error("Failed to leave the voting session")
      return
    }

    await revalidateParticipant(voting_id)
    await revalidateResultByVotingId(voting_id)
    window.location.reload()
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Voting Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave this voting session? Once you leave,
            you will lose access to vote and view session details. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={leaveHandler}>
              <LogOut />
              Leave
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
