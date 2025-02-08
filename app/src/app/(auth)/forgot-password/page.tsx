"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import { useSupabase } from "@/utils/supabase/client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email("Invalid email!"),
})

export default function ForgotPasswordPage() {
  const supabase = useSupabase()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = React.useCallback(
    async ({ email }: z.infer<typeof formSchema>) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Email has been sent, if email exists.")
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const { isSubmitting: isPending } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">Forgot Password?</h1>
            <p className="text-balance text-muted-foreground">
              No worries, we&apos;ll send you an OTP
            </p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader className="animate-spin" />}Send OTP
          </Button>
          <div className="text-center text-sm">
            Already have an account?&nbsp;
            <Link href="/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
