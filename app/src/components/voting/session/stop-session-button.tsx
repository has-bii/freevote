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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader, Pause } from "lucide-react"
import { toast } from "sonner"
import { useSupabase } from "@/utils/supabase/client"
import { revalidateSession } from "@/app/(api)/api/session/[voting_id]/get-session-cached"
import { useQueryClient } from "@tanstack/react-query"

type Props = {
  session_id: string
  voting_id: string
}

export default function StopSessionButton({ session_id, voting_id }: Props) {
  const supabase = useSupabase()
  const query = useQueryClient()

  const endHandler = React.useCallback(async () => {
    const toast_id = toast.loading(
      <div className="flex w-full items-center gap-2 [&_svg]:size-4">
        <Loader className="animate-spin" />
        <span>Ending session...</span>
      </div>,
      {
        duration: Infinity,
      },
    )

    const { error } = await supabase
      .from("sessions")
      .update({
        session_end_at: new Date().toISOString(),
      })
      .eq("id", session_id)

    toast.dismiss(toast_id)

    if (error) {
      toast.error(error.message)
      return
    }

    await revalidateSession(voting_id)
    query.invalidateQueries({
      queryKey: ["session", voting_id],
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Pause />
          End session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Session</DialogTitle>
          <DialogDescription>Do you want to end the session?</DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={endHandler}>
              <Pause />
              End session
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
