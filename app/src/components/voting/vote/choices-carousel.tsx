"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { TChoice, TVote } from "@/types/model";
import { CircleCheckBig, ImageOff, Loader } from "lucide-react";
import Image from "next/image";
import React from "react";
import GiveVoteConfirm from "./give-vote-confirm";

type Props = {
  setApi: (api: CarouselApi) => void;
  choices: TChoice[];
  session_id: string;
  hasVoted?: TVote | null;
  closeModal: () => void;
};

export default function ChoicesCarousel(props: Props) {
  const { choices, session_id, setApi, hasVoted, closeModal } = props;

  const isLoading = React.useMemo(() => hasVoted === undefined, [hasVoted]);
  const voted = React.useMemo(() => !!hasVoted, [hasVoted]);

  return (
    <Carousel className="w-full" setApi={setApi}>
      <CarouselContent>
        {choices.map((choice) => (
          <CarouselItem key={choice.id}>
            <div className="p-4">
              <Card className="overflow-hidden">
                <div className="relative flex aspect-video w-full items-center justify-center bg-border">
                  {choice.image ? (
                    <Image
                      alt={choice.name}
                      src={choice.image}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageOff className="size-10" />
                  )}
                </div>
                <CardContent className="h-fit w-full space-y-1.5 p-6">
                  <span className="font-semibold" draggable>
                    {choice.name}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {choice.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <GiveVoteConfirm
                    closeModal={closeModal}
                    choice_id={choice.id}
                    session_id={session_id}
                    voting_id={choice.voting_id}
                  >
                    <Button className="w-full" disabled={isLoading || voted}>
                      {isLoading ? (
                        <>
                          <Loader className="animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <CircleCheckBig />
                          {voted ? "Voted" : "Vote"}
                        </>
                      )}
                    </Button>
                  </GiveVoteConfirm>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
