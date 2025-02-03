"use client"

import React from "react"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Image from "next/image"
import { cn } from "@/lib/utils"

type Features = {
  title: string
  desc: string
  img: string
}

const features: Features[] = [
  {
    title: "Welcome to Quick Vote",
    desc: "Create, manage, and join votings with ease. Whether it's a quick poll or a detailed survey, we make voting simple and fun for everyone.",
    img: "/quick-vote-features.png",
  },
  {
    title: "Real-Time Results",
    desc: "Watch the results come in live as participants vote. Get instant insights and make data-driven decisions effortlessly.",
    img: "/quick-vote-features2.png",
  },
  {
    title: "Customizable Choices",
    desc: "Add as many choices as you need for each voting session. Make your votings as simple or as detailed as you want.",
    img: "/quick-vote-features3.png",
  },
]

export default function ImageCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

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

  return (
    <div className="hidden flex-1 overflow-hidden bg-muted lg:flex">
      <div className="m-auto w-full space-y-8">
        <Carousel setApi={setApi} className="w-full max-w-full">
          <CarouselContent>
            {features.map(({ desc, img, title }, index) => (
              <CarouselItem key={index} className="flex flex-col space-y-8">
                <div className="relative mx-auto aspect-video h-80 overflow-hidden rounded-lg">
                  <Image
                    alt=""
                    src={img}
                    fill
                    className="object-cover object-top"
                    sizes="45vw"
                  />
                </div>
                <div className="mx-auto max-w-md space-y-2">
                  <p className="text-center text-xl font-semibold">{title}</p>
                  <p className="text-center text-sm text-muted-foreground">
                    {desc}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mx-auto flex items-center justify-center gap-3">
          {Array.from({ length: count }).map((_, i) => (
            <div
              role="button"
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-1 w-20 transition-colors duration-300 ease-in-out",
                current === i + 1
                  ? "bg-black dark:bg-white"
                  : "bg-black/20 dark:bg-white/20",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
