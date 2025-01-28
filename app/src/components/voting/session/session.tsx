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
import { format, intlFormatDistance, isPast } from "date-fns";
import { useSupabase } from "@/utils/supabase/client";
import DeleteSession from "./delete-session";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  data: TSession;
  is_owner: boolean;
  choices: TChoice[];
};

export default function Session({ data, is_owner, choices }: Props) {
  const supabase = useSupabase();
  const query = useQueryClient();

  const isStart = isPast(data.session_start_at);
  const isEnd = isPast(data.session_end_at);

  const countDown =
    isStart && !isEnd
      ? `Ends ${intlFormatDistance(data.session_end_at, new Date())}`
      : !isStart
        ? `Starts ${intlFormatDistance(data.session_start_at, new Date())}`
        : `Ended ${intlFormatDistance(data.session_end_at, new Date())}`;

  const filteredChoices = choices.filter((c) => data.choices.includes(c.id));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{data.name}</CardTitle>
          {is_owner && (
            <DeleteSession id={data.id} supabase={supabase} query={query}>
              <Button size="sm" variant="destructive">
                <Trash2 />
                Delete
              </Button>
            </DeleteSession>
          )}
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
      <CardFooter>
        {countDown && (
          <p className="truncate text-nowrap text-sm text-muted-foreground">
            {countDown}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
