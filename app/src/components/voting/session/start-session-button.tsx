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
import { CirclePlay, Loader } from "lucide-react"
import { toast } from "sonner"
import { useSupabase } from "@/utils/supabase/client"
import { revalidateSession } from "@/app/(api)/api/session/[voting_id]/get-session-cached"
import { useQueryClient } from "@tanstack/react-query"

type Props = {
  session_id: string
  voting_id: string
}

export default function StartSessionButton({ session_id, voting_id }: Props) {
  const supabase = useSupabase()
  const query = useQueryClient()

  const startHandler = React.useCallback(async () => {
    const toast_id = toast.loading(
      <div className="flex w-full items-center gap-2 [&_svg]:size-4">
        <Loader className="animate-spin" />
        <span>Starting session...</span>
      </div>,
      {
        duration: Infinity,
      },
    )

    const { error } = await supabase
      .from("sessions")
      .update({
        session_start_at: new Date().toISOString(),
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
          <CirclePlay />
          Start
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Session</DialogTitle>
          <DialogDescription>
            Do you want to start the session? You can end the session later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={startHandler}>
              <CirclePlay />
              Start
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
