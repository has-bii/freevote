"use client";

import { ChartContainer } from "@/components/ui/chart";
import { TChoice, TResult } from "@/types/model";
import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { type ChartConfig } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSupabase } from "@/utils/supabase/client";
import { useGetResult } from "@/hooks/result/use-result";
import { Pie, PieChart } from "recharts";
import { ResultDataTable } from "./table/result-data-table";
import { resultColumns } from "./table/result-columns";
import { useGetAuth } from "@/hooks/auth/use-auth";

type Props = {
  data: TResult;
  session_id: string;
  choices: TChoice[];
  participants: number;
  owner_id: string;
};

export default function ResultChart({ data: initialData, ...props }: Props) {
  const { session_id, choices, participants, owner_id } = props;
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const { data } = useGetResult({
    initialData,
    session_id,
    supabase,
  });

  // Bar
  const chartData = React.useMemo(() => {
    const mappedChoices = choices.map((choice, i) => ({
      choice: choice.name,
      count: 0,
      id: choice.id,
      fill: `hsl(var(--chart-${i + 1}))`,
    }));

    data.votes.forEach((vote) => {
      const temp =
        mappedChoices[mappedChoices.findIndex((c) => c.id === vote.choice_id)];

      if (temp) temp.count++;
    });

    return mappedChoices;
  }, [choices, data.votes]);

  // Bar config
  const chartConfig = React.useMemo(() => {
    const temp = new Object();

    chartData.forEach((d) => {
      Object.defineProperty(temp, d.choice, { value: { label: d.choice } });
    });

    return temp;
  }, [chartData]);

  // Pie
  const chartData2 = React.useMemo(() => {
    const temp = chartData.map((d) => ({
      choice: d.choice,
      count: Math.round((d.count / participants) * 100),
      fill: d.fill,
    }));

    temp.push({
      choice: "Don't Vote",
      count: Math.round(
        ((participants - data.votes.length) / participants) * 100,
      ),
      fill: `hsl(var(--primary))`,
    });

    return temp;
  }, [chartData, data.votes.length, participants]);

  // Pie config
  const chartConfig2 = React.useMemo(() => {
    const temp = new Object();

    chartData.forEach((d) => {
      Object.defineProperty(temp, d.choice, { value: { label: d.choice } });
    });

    return temp;
  }, [chartData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isOwner = React.useMemo(() => user?.id === owner_id, [user]);

  return (
    <>
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        {/* Bar */}
        <Card className="w-full lg:flex-1">
          <CardHeader>
            <CardTitle>Total Votes Breakdown</CardTitle>
            <CardDescription>
              See the number of votes each choice received in this voting
              session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig as ChartConfig}
              className="min-h-[200px] w-full lg:max-h-[250px]"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="choice"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value: string) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="count" fill="var(--color-choice)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Vote Distribution</CardTitle>
            <CardDescription className="text-center">
              View the percentage share of votes for each choice in this voting
              session.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig2 as ChartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name) => (
                        <div className="inline-flex items-center gap-2">
                          <span className="text-muted-foreground">{name}</span>
                          <span className="font-medium">{value}%</span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie data={chartData2} dataKey="count" nameKey="choice" />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="text-center leading-none text-muted-foreground">
              A total of {data.votes.length} votes were cast by {participants}{" "}
              participants in this voting session.
            </div>
          </CardFooter>
        </Card>
      </div>

      {isOwner && (
        <ResultDataTable
          columns={resultColumns}
          data={data.votes}
          choices={choices}
        />
      )}
    </>
  );
}
