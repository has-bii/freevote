"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CircleCheckBig } from "lucide-react";
import { TChoice, TVote } from "@/types/model";
import { CarouselApi } from "@/components/ui/carousel";
import { useMediaQuery } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChoicesCarousel from "@/components/voting/vote/choices-carousel";

type Props = {
  choices: TChoice[];
  name: string;
  description: string | null;
  session_id: string;
  votes: TVote[];
};

export default function GiveVote({
  choices,
  description,
  name,
  session_id,
  votes,
}: Props) {
  const [api, setApi] = React.useState<CarouselApi>();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog>
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
              votes={votes}
              session_id={session_id}
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
    );

  return (
    <Drawer>
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
            votes={votes}
            session_id={session_id}
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
  );
}
