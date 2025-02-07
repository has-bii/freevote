/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CircleCheckBig } from "lucide-react"
import { TChoice } from "@/types/model"
import { CarouselApi } from "@/components/ui/carousel"
import { useMediaQuery } from "usehooks-ts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ChoicesCarousel from "@/components/voting/vote/choices-carousel"
import { useSupabase } from "@/utils/supabase/client"
import { useHasVoted } from "@/hooks/votes/use-has-voted"

type Props = {
  choices: TChoice[]
  name: string
  description: string | null
  session_id: string
}

const GiveVote = React.memo(function GiveVote(props: Props) {
  const { choices, description, name, session_id } = props
  const [open, setOpen] = React.useState(false)
  const supabase = useSupabase()
  const { data: hasVoted } = useHasVoted({
    session_id,
    supabase,
    enabled: open,
  })
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <CircleCheckBig />
            Vote
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="mx-auto w-full md:max-w-md">
            <DialogHeader>
              <DialogTitle>{name}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <ChoicesCarousel
              choices={choices}
              setApi={setApi}
              session_id={session_id}
              hasVoted={hasVoted}
              closeModal={() => setOpen(false)}
            />
            <DialogFooter className="mt-4">
              <div className="flex w-full gap-2">
                <Button
                  className="flex-1"
                  onClick={() => api?.scrollPrev()}
                  disabled={!api?.canScrollPrev()}
                >
                  <ArrowLeft />
                  Previous
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => api?.scrollNext()}
                  disabled={!api?.canScrollNext()}
                >
                  Next
                  <ArrowRight />
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    )

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm">
          <CircleCheckBig />
          Vote
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>{name}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <ChoicesCarousel
            choices={choices}
            setApi={setApi}
            session_id={session_id}
            hasVoted={hasVoted}
            closeModal={() => setOpen(false)}
          />
          <DrawerFooter>
            <div className="flex w-full gap-2">
              <Button
                className="flex-1"
                onClick={() => api?.scrollPrev()}
                disabled={!api?.canScrollPrev()}
              >
                <ArrowLeft />
                Previous
              </Button>
              <Button
                className="flex-1"
                onClick={() => api?.scrollNext()}
                disabled={!api?.canScrollNext()}
              >
                Next
                <ArrowRight />
              </Button>
            </div>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
})

export default GiveVote
