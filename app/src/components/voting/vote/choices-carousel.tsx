"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useGetAuth } from "@/hooks/auth/use-auth";
import { TChoice, TVote } from "@/types/model";
import { useSupabase } from "@/utils/supabase/client";
import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import React, { useMemo } from "react";
import GiveVoteConfirm from "./give-vote-confirm";

type Props = {
  votes: TVote[];
  setApi: (api: CarouselApi) => void;
  choices: TChoice[];
  session_id: string;
};

export default function ChoicesCarousel({
  choices,
  session_id,
  setApi,
  votes,
}: Props) {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);

  const hasVoted = useMemo((): boolean => {
    if (!user) return false;

    return votes.some((v) => v.user_id === user.id);
  }, [user, votes]);

  return (
    <Carousel className="w-full" setApi={setApi}>
      <CarouselContent>
        {choices.map((choice) => (
          <CarouselItem key={choice.id}>
            <div className="p-4">
              <Card className="overflow-hidden">
                <div className="relative aspect-video w-full">
                  {choice.image && (
                    <Image
                      alt={choice.name}
                      src={choice.image}
                      fill
                      className="object-cover"
                    />
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
                    choice_id={choice.id}
                    session_id={session_id}
                    voting_id={choice.voting_id}
                  >
                    <Button className="w-full" disabled={hasVoted}>
                      <CircleCheckBig />
                      {hasVoted ? "Voted" : "Vote"}
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
