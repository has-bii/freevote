"use client";

import { TChoice, TSession } from "@/types/model";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  differenceInSeconds,
  format,
  intlFormatDistance,
  isPast,
} from "date-fns";
import DeleteSession from "./delete-session";
import { Button } from "@/components/ui/button";
import { ChartPie } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import GiveVote from "./give-vote";
import Link from "next/link";

type Props = {
  data: TSession;
  is_owner: boolean;
  isParticipant: boolean;
  choices: TChoice[];
};

export default function Session({ data, ...props }: Props) {
  const { is_owner, choices, isParticipant } = props;
  const [now, setNow] = React.useState(new Date());
  const [progress, setProgress] = React.useState(0);

  const { session_start_at, session_end_at, created_at } = data;

  const [isStart, isEnd] = React.useMemo(() => {
    return [isPast(session_start_at), isPast(session_end_at)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  const countDown = React.useMemo(() => {
    return isStart && !isEnd
      ? `Ends ${intlFormatDistance(session_end_at, now)}`
      : !isStart
        ? `Starts ${intlFormatDistance(session_start_at, now)}`
        : `Ended ${intlFormatDistance(session_end_at, now)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  React.useEffect(() => {
    const change = () => {
      const laterDate = isStart ? session_end_at : session_start_at;
      const earlierDate = isStart ? session_start_at : created_at;

      const diff = differenceInSeconds(laterDate, earlierDate);
      const diffFromNow = differenceInSeconds(
        isStart ? session_end_at : session_start_at,
        now,
      );

      if (!isEnd) {
        const result = (diffFromNow / diff) * 100;

        if (result >= 100) setProgress(100);
        else setProgress(result);

        setNow(new Date());
      }
    };

    const to = !isEnd ? setTimeout(() => change(), 1000) : null;

    return () => {
      if (to) clearTimeout(to);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  // Filter choice
  const filteredChoices = React.useMemo(
    () => choices.filter((c) => data.choices.includes(c.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{data.name}</CardTitle>
          <div className="inline-flex gap-2">
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
              {data.session_start_at && format(data.session_start_at, "PPp")}
            </span>
          </div>

          {/* End */}
          <div className="space-y-0.5">
            <span className="text-right text-xs text-muted-foreground">
              End Date Time
            </span>
            <span className="block font-medium">
              {data.session_end_at && format(data.session_end_at, "PPp")}
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
        {countDown && (
          <p className="shrink-0 truncate text-nowrap text-sm text-muted-foreground">
            {countDown}
          </p>
        )}
        {isStart && !isEnd ? <Progress value={progress} /> : ""}
        {isEnd && (
          <Button asChild size="sm" className="ml-auto">
            <Link href={`/votings/${data.voting_id}/result/${data.id}`}>
              <ChartPie />
              See result
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
