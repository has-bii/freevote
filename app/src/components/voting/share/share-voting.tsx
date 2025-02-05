"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useShareVoting } from "./use-share-voting"
import { Button } from "@/components/ui/button"
import { Fingerprint, LinkIcon } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import TooltipTimer from "@/components/tooltip-timer"

export default function ShareVoting() {
  const { close, id } = useShareVoting()

  return (
    <Dialog open={id !== null} onOpenChange={close}>
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
            <TooltipTimer text="copied">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(id!)
                }}
              >
                <Fingerprint />
                Copy ID
              </Button>
            </TooltipTimer>
            <TooltipTimer text="copied">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_APP_URL}/votings/${id}`,
                  )
                }}
              >
                <LinkIcon />
                Copy Link
              </Button>
              <Button className="ml-auto" onClick={close}>
                Done
              </Button>
            </TooltipTimer>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  )
}
