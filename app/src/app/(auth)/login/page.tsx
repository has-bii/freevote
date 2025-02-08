"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/(auth)/login/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React, { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import LoginGoogleButton from "@/components/login-google-button"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form action={formAction} className="p-6 md:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-balance text-muted-foreground">
            Login to your account
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            defaultValue={state?.input?.email}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader className="animate-spin" />}Login
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <LoginGoogleButton />
        <div className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            Don&apos;t have an account?&nbsp;
            <Link href="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
          <Link
            href="/resend-confirmation"
            className="w-full text-center text-sm underline underline-offset-4"
          >
            Resend Confirmation Email
          </Link>
        </div>
      </div>
    </form>
  )
}
