"use client"

import React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Fingerprint, LinkIcon } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import TooltipTimer from "@/components/tooltip-timer"

interface ShareVotingProps extends React.ComponentProps<typeof Dialog> {
  voting_id: string
}

export default function ShareVoting({ voting_id, ...props }: ShareVotingProps) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Voting Session</DialogTitle>
          <DialogDescription>
            Invite others to join your voting session by sharing the unique
            Voting ID or sharing the link. Choose your preferred sharing method
            below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <TooltipTimer
              text="copied"
              onClick={() => {
                navigator.clipboard.writeText(voting_id)
              }}
            >
              <Button variant="outline">
                <Fingerprint />
                Copy ID
              </Button>
            </TooltipTimer>
            <TooltipTimer
              text="copied"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_APP_URL}/votings/${voting_id}`,
                )
              }}
            >
              <Button variant="outline">
                <LinkIcon />
                Copy Link
              </Button>
            </TooltipTimer>
            <DialogClose asChild>
              <Button className="ml-auto">Done</Button>
            </DialogClose>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  )
}
