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
import { TChoice } from "@/types/model";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
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

type Props = {
  choices: TChoice[];
  name: string;
  description: string | null;
};

export default function GiveVote({ choices, description, name }: Props) {
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
              <DialogDescription>{description}testset</DialogDescription>
            </DialogHeader>
            <Carousel className="mt-4 w-full" setApi={setApi}>
              <CarouselContent>
                {choices.map((choice) => (
                  <CarouselItem key={choice.id}>
                    <div className="p-1">
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
                          <span className="font-semibold">{choice.name}</span>
                          <p className="text-sm text-muted-foreground">
                            {choice.description}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full">
                            <CircleCheckBig />
                            Vote
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
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
                        <span className="font-semibold">{choice.name}</span>
                        <p className="text-sm text-muted-foreground">
                          {choice.description}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          <CircleCheckBig />
                          Vote
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
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
