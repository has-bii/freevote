"use client"

import { TSession } from "@/types/model"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React from "react"
import { useRouter } from "next/navigation"
import { isPast } from "date-fns"

type Props = {
  voting_id: string
  data: TSession[]
  current: string
}

export default function SelectSessions({ data, current, voting_id }: Props) {
  const router = useRouter()

  const filtered = React.useMemo(
    () =>
      data.filter((d) => (d.session_end_at ? isPast(d.session_end_at) : false)),
    [data],
  )

  return (
    <Select
      defaultValue={current}
      onValueChange={(v) => {
        router.push(`/votings/${voting_id}/result/${v}`)
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a session" />
      </SelectTrigger>
      <SelectContent>
        {filtered.map(({ id, name }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
