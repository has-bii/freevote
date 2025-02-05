"use client"

import React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
  children: React.ReactNode
  text: string
}

export default function TooltipTimer({ children, text }: Props) {
  const [clicked, setClicked] = React.useState(false)

  React.useEffect(() => {
    const to = setTimeout(() => setClicked(false), 3000)

    return () => {
      clearTimeout(to)
    }
  }, [clicked])

  return (
    <Tooltip open={clicked} onOpenChange={setClicked} disableHoverableContent>
      <TooltipTrigger asChild disabled={clicked}>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}
