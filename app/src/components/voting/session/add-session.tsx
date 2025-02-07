"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader, Plus, TimerIcon } from "lucide-react"
import { useSupabase } from "@/utils/supabase/client"
import { useGetChoices } from "@/hooks/choices/use-get-choices"
import { z } from "zod"
import { description, stringAlphabetNumber } from "@/lib/form-schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { format, isAfter } from "date-fns"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { revalidateSession } from "@/app/(api)/api/session/[voting_id]/get-session-cached"
import { TChoice } from "@/types/model"
import { useGetAuth } from "@/hooks/auth/use-auth"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

type Props = {
  voting_id: string
  owner_id: string
  initialData: {
    choice: TChoice[]
  }
}

const FormSchema = z
  .object({
    name: stringAlphabetNumber,
    description: description,
    choices: z.array(z.string().uuid()).min(2, "Min. 2 choices"),
    session_start_at: z.string(),
    session_end_at: z.string(),
    type: z.enum(["custom", "default"]),
  })
  .superRefine((values, ctx) => {
    if (values.type === "default") {
      if (isAfter(values.session_end_at, values.session_start_at))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid date",
          path: ["session_end_at"],
        })

      return z.NEVER
    }
  })

export default function AddSession({
  voting_id,
  owner_id,
  initialData: { choice },
}: Props) {
  const [open, setOpen] = React.useState(false)
  const supabase = useSupabase()
  const query = useQueryClient()
  const { data: choices } = useGetChoices({
    supabase,
    voting_id,
    initialData: choice,
  })
  const { data: user } = useGetAuth(supabase)

  // Date time formatter
  const getDateTimeFormat = React.useCallback(
    (newDate: string | Date = new Date()) =>
      `${format(newDate, "yyyy-MM-dd")}T${format(newDate, "HH:mm")}`,
    [],
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      choices: [],
      session_start_at: getDateTimeFormat(),
      session_end_at: getDateTimeFormat(),
      type: "custom",
    },
  })

  const onSubmit = React.useCallback(
    async (payload: z.infer<typeof FormSchema>) => {
      const { type, ...data } = payload

      const { error } = await supabase.from("sessions").insert({
        ...data,
        session_start_at:
          type === "custom"
            ? null
            : new Date(payload.session_start_at).toISOString(),
        session_end_at:
          type === "custom"
            ? null
            : new Date(payload.session_end_at).toISOString(),
        voting_id,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("New session has been created")
      query.invalidateQueries({
        queryKey: ["session", voting_id],
      })
      await revalidateSession(voting_id)
      form.reset()
      setOpen(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const type = form.watch("type")

  const isOwner = React.useMemo(
    () => user?.id === owner_id,
    [owner_id, user?.id],
  )

  if (isOwner)
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
                        Select the choices you want to display in the session.
                        At least 2 choices.
                      </FormDescription>
                    </div>
                    <ScrollArea className="h-32 w-full">
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
                                        ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id,
                                            ),
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {item.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </ScrollArea>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type of session" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      You can set the start and end of the session at any time.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="session_start_at"
                render={({ field }) => (
                  <FormItem className={cn(type !== "default" ? "hidden" : "")}>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="datetime-local"
                          className="w-fit"
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
                  <FormItem className={cn(type !== "default" ? "hidden" : "")}>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="datetime-local"
                          className="w-fit"
                          {...field}
                        />
                        <div className="flex flex-1 gap-1">
                          <Button
                            type="button"
                            onClick={() =>
                              form.setValue(
                                "session_end_at",
                                getDateTimeFormat(),
                              )
                            }
                          >
                            Now
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
    )
}
