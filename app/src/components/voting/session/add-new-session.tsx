"use client";

import { TVoting } from "@/types/model";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, Plus, TimerIcon } from "lucide-react";
import { useSupabase } from "@/utils/supabase/client";
import { useGetChoices } from "@/hooks/choices/use-get-choices";
import { z } from "zod";
import { description, stringAlphabetNumber } from "@/lib/form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { addMinutes, format } from "date-fns";
import { actionAddSession } from "@/actions/add-session";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  data: TVoting;
};

const FormSchema = z.object({
  name: stringAlphabetNumber,
  description: description,
  choices: z.array(z.string().uuid()).min(2, "Min. 2 choices"),
  session_start_at: z.string(),
  session_end_at: z.string(),
});

export default function AddNewSession({ data: { id: voting_id } }: Props) {
  const [open, setOpen] = React.useState(false);
  const supabase = useSupabase();
  const query = useQueryClient();
  const { data: choices } = useGetChoices({ supabase, voting_id });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      choices: [],
      session_start_at: getDateTimeFormat(),
      session_end_at: getDateTimeFormat(),
    },
    mode: "onChange",
  });

  const onSubmit = async (payload: z.infer<typeof FormSchema>) => {
    const formData = new FormData();

    formData.set("voting_id", voting_id);
    formData.set("name", payload.name);
    formData.set("description", payload.description);
    formData.set(
      "session_start_at",
      new Date(payload.session_start_at).toISOString(),
    );
    formData.set(
      "session_end_at",
      new Date(payload.session_end_at).toISOString(),
    );
    payload.choices.forEach((v) => {
      formData.append("choices", v);
    });

    const { error } = await actionAddSession(formData);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("New session has been created");
    query.invalidateQueries({
      queryKey: ["session", voting_id],
    });
    form.reset();
    setOpen(false);
  };

  function getDateTimeFormat(newDate: string | Date = new Date()) {
    return `${format(newDate, "yyyy-MM-dd")}T${format(newDate, "HH:mm")}`;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <TimerIcon />
          New Session
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription>
            Set up a new session for your voting. Define the session details,
            including name, description, choices, and schedule.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:text-destructive after:content-['*']">
                    Session Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="First Session" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="choices"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base after:text-destructive after:content-['*']">
                      Choices
                    </FormLabel>
                    <FormDescription>
                      Select the choices you want to display in the session. At
                      least 2 choices.
                    </FormDescription>
                  </div>
                  {choices?.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="choices"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="session_start_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="datetime-local"
                        className="w-fit"
                        min={getDateTimeFormat()}
                        {...field}
                      />
                      <div className="flex flex-1 gap-2">
                        <Button
                          type="button"
                          onClick={() =>
                            form.setValue(
                              "session_start_at",
                              getDateTimeFormat(),
                            )
                          }
                        >
                          Now
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Must be in the future</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="session_end_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="datetime-local"
                        className="w-fit"
                        min={getDateTimeFormat(
                          form.getValues("session_start_at"),
                        )}
                        {...field}
                      />
                      <div className="flex flex-1 gap-1">
                        <Button
                          type="button"
                          onClick={() =>
                            form.setValue("session_end_at", getDateTimeFormat())
                          }
                        >
                          Now
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            form.setValue(
                              "session_end_at",
                              getDateTimeFormat(
                                addMinutes(
                                  form.getValues("session_start_at"),
                                  30,
                                ),
                              ),
                            );
                          }}
                        >
                          30 min. from start
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Must be after start time</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                <Plus />
              )}
              Add
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
