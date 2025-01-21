"use client";

import { TVoting } from "@/types/model";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, setHours, setMinutes } from "date-fns";
import { CalendarIcon, Loader, Timer } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { TSupabaseClient } from "@/utils/supabase/server";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  data: TVoting;
  supabase: TSupabaseClient;
  query: QueryClient;
};

const FormSchema = z.object({
  date: z.date(),
  time: z.string(),
});

export default function StartSession({ data, ...rest }: Props) {
  const { query, supabase } = rest;
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    },
  });

  const onSubmit = async ({ date, time }: z.infer<typeof FormSchema>) => {
    const hours = parseInt(time.split(":")[0]);
    const minutes = parseInt(time.split(":")[1]);

    if (isNaN(hours) || isNaN(minutes)) {
      toast.error("Invalid time!");
      return;
    }

    let newDate = setHours(date, hours);
    newDate = setMinutes(date, minutes);

    const { error, data: newData } = await supabase
      .from("votings")
      .update({ is_start: true, expired_session: newDate.toISOString() })
      .eq("id", data.id)
      .select("*")
      .single();

    if (error) {
      toast.error("Failed to start session. Please try again.");
      return;
    }

    query.setQueryData<TVoting>(["voting", data.id], () => newData);
  };

  const startNowHandler = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("votings")
      .update({ is_start: true })
      .eq("id", data.id);
    setLoading(false);

    if (error) {
      toast.error("Failed to start session");
      return;
    }

    query.setQueryData<TVoting>(["voting", data.id], (prev) =>
      prev ? { ...prev, is_start: true } : undefined,
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm">Start session</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                className="flex-1"
                onClick={startNowHandler}
                disabled={loading}
              >
                Start now {loading && <Loader className="animate-spin" />}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={form.formState.isSubmitting}
              >
                Start until{" "}
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Timer />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
