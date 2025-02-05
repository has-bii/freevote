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
  onClick: () => void
}

export default function TooltipTimer({ children, text, onClick }: Props) {
  const [clicked, setClicked] = React.useState(false)

  React.useEffect(() => {
    let to: NodeJS.Timeout | null = null

    if (clicked) to = setTimeout(() => setClicked(false), 3000)

    return () => {
      if (to) clearTimeout(to)
    }
  }, [clicked])

  const clickHandler = React.useCallback(() => {
    onClick()

    setClicked(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tooltip open={clicked}>
      <TooltipTrigger asChild disabled={clicked} onClick={clickHandler}>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}
