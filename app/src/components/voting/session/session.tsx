"use client"

import { TChoice, TSession } from "@/types/model"
import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format, intlFormatDistance, isPast } from "date-fns"
import DeleteSession from "./delete-session"
import { Button } from "@/components/ui/button"
import { ChartPie } from "lucide-react"
import GiveVote from "./give-vote"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import StartSessionButton from "./start-session-button"
import StopSessionButton from "./stop-session-button"

type Props = {
  data: TSession
  is_owner: boolean
  isParticipant: boolean
  choices: TChoice[]
}

export default function Session({ data, ...props }: Props) {
  const { is_owner, choices, isParticipant } = props
  const [now, setNow] = React.useState(new Date())

  const { session_start_at, session_end_at } = data

  const [isStart, isEnd] = React.useMemo(() => {
    return [
      session_start_at ? isPast(session_start_at) : false,
      session_end_at ? isPast(session_end_at) : false,
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now])

  const countDown = React.useMemo(() => {
    if (!session_start_at && !session_end_at)
      return "Session is not started yet"

    if (session_start_at && !session_end_at) return "Session has been started"

    if (!session_start_at || !session_end_at) return ""

    return isStart && !isEnd
      ? `Ends ${intlFormatDistance(session_end_at, now)}`
      : !isStart
        ? `Starts ${intlFormatDistance(session_start_at, now)}`
        : `Ended ${intlFormatDistance(session_end_at, now)}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now])

  React.useEffect(() => {
    const to = !isEnd ? setTimeout(() => setNow(new Date()), 1000) : null

    return () => {
      if (to) clearTimeout(to)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now])

  // Filter choice
  const filteredChoices = React.useMemo(
    () => choices.filter((c) => data.choices.includes(c.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{data.name}</CardTitle>
          <Badge>
            {!session_start_at && !session_end_at ? "custom" : "default"}
          </Badge>
          <div className="ml-auto inline-flex gap-2">
            {!isStart && is_owner ? (
              <StartSessionButton
                session_id={data.id}
                voting_id={data.voting_id}
              />
            ) : isStart && !isEnd && is_owner ? (
              <StopSessionButton
                session_id={data.id}
                voting_id={data.voting_id}
              />
            ) : (
              ""
            )}
            {isStart && !isEnd && isParticipant ? (
              <GiveVote
                session_id={data.id}
                choices={filteredChoices}
                name={data.name}
                description={data.description}
              />
            ) : (
              ""
            )}
            {is_owner && <DeleteSession data={data} />}
          </div>
        </div>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          {/* Start */}
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground">
              Start Date Time
            </span>
            <span className="block font-medium">
              {data.session_start_at
                ? format(data.session_start_at, "PPp")
                : "TBD"}
            </span>
          </div>

          {/* End */}
          <div className="space-y-0.5">
            <span className="text-right text-xs text-muted-foreground">
              End Date Time
            </span>
            <span className="block font-medium">
              {data.session_end_at ? format(data.session_end_at, "PPp") : "TBD"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Choices</div>
          <div className="space-y-1">
            {filteredChoices.map((c) => (
              <div key={c.id} className="text-sm">
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-4">
        <p className="shrink-0 truncate text-nowrap text-sm text-muted-foreground">
          {countDown}
        </p>
        {isStart && is_owner ? (
          <Button asChild size="sm" className="ml-auto">
            <Link href={`/votings/${data.voting_id}/result/${data.id}`}>
              <ChartPie />
              See result
            </Link>
          </Button>
        ) : isEnd && isParticipant ? (
          <Button asChild size="sm" className="ml-auto">
            <Link href={`/votings/${data.voting_id}/result/${data.id}`}>
              <ChartPie />
              See result
            </Link>
          </Button>
        ) : (
          ""
        )}
      </CardFooter>
    </Card>
  )
}
