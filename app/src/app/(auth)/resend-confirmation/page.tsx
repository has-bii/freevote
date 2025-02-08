"use client"

import { email } from "@/lib/form-schema"
import { useSupabase } from "@/utils/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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
import Link from "next/link"
import { Loader, Mail } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  email: email,
})

export default function Page() {
  const supabase = useSupabase()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = React.useCallback(
    async ({ email }: z.infer<typeof formSchema>) => {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Email confirmation has been sent")
      form.reset()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Resend Confirmation</h1>
            <p className="text-balance text-muted-foreground">
              Type your registered email. Confirmation instruction will be
              resend to your inbox.
            </p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
                </FormControl>
                <FormDescription>Enter your registered email.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {isSubmitting ? <Loader className="animate-spin" /> : <Mail />}
            Send confirmation email
          </Button>
          <Link
            href="/login"
            className="w-full text-center text-sm underline underline-offset-4"
          >
            Back to login
          </Link>
        </div>
      </form>
    </Form>
  )
}
