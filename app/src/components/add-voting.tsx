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
import { z } from "zod"
import { description, icon, stringAlphabetNumber } from "@/lib/form-schema"
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
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loader, MousePointer2, Plus } from "lucide-react"
import { useSupabase } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import DynamicIconn from "./dynamic-icon"
import IconPicker from "./icon-picker"
import { IconName } from "lucide-react/dynamic"

type Props = {
  children: React.ReactNode
}

const FormSchema = z.object({
  name: stringAlphabetNumber,
  description: description,
  icon: icon,
})

export default function AddVoting({ children }: Props) {
  const [open, setOpen] = React.useState<boolean>(false)
  const query = useQueryClient()
  const supabase = useSupabase()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const onSubmit = async (payload: z.infer<typeof FormSchema>) => {
    try {
      const { error, data } = await supabase
        .from("votings")
        .insert(payload)
        .select("*")
        .single()

      if (error) {
        toast.error("Failed to add new voting")
        return
      }

      query.invalidateQueries({ queryKey: ["votings"] })
      setOpen(false)
      form.reset()
      router.push(`/votings/${data.id}`)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("Unexpected error has occurred!")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Voting</DialogTitle>
          <DialogDescription>
            Provide a name, optional description, and type for your new voting
            session.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The voting name will be displayed.
                  </FormDescription>
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
                    <Textarea
                      placeholder="Tell us about the voting"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Max is 255 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Icon</FormLabel>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            <>
                              <DynamicIconn
                                name={field.value as IconName}
                                className="h-4 w-4"
                              />
                              <span className="capitalize">
                                {field.value.replaceAll("-", " ")}
                              </span>
                            </>
                          ) : (
                            <>
                              <span>Pick an icon</span>
                              <MousePointer2 className="ml-auto h-4 w-4 opacity-50" />
                            </>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <React.Suspense fallback={"Loading..."}>
                        <IconPicker
                          icon={field.value}
                          onSelectIcon={field.onChange}
                        />
                      </React.Suspense>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Plus />
                )}
                Add
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
