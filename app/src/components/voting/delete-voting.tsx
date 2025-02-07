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
import { useSupabase } from "@/utils/supabase/client"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { revalidateVoting } from "@/app/(api)/api/voting/[voting_id]/get-voting-by-id-cached"
import { Trash2 } from "lucide-react"

interface DeleteVotingProps extends React.ComponentProps<typeof Dialog> {
  voting_id: string
}

export default function DeleteVoting({
  voting_id,
  ...props
}: DeleteVotingProps) {
  const supabase = useSupabase()
  const query = useQueryClient()
  const router = useRouter()

  const deleteHandler = React.useCallback(async () => {
    const toast_id = toast.loading("Deleting voting data...", {
      duration: Infinity,
    })

    const { error } = await supabase
      .from("votings")
      .delete()
      .eq("id", voting_id)

    toast.dismiss(toast_id)

    if (error) {
      toast.error(error.message)
      return
    }

    await revalidateVoting(voting_id)
    query.invalidateQueries({ queryKey: ["votings"] })
    revalidateVoting(voting_id)
    router.push("/votings")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete voting
            data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={deleteHandler}>
              <Trash2 />
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
