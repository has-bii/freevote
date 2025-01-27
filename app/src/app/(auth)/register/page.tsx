"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "./actions";
import Link from "next/link";
import { useActionState } from "react";
import { Loader } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signup, null);

  React.useEffect(() => {
    if (state?.message) {
      if (state.success) toast.success(state.message);
      else toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="p-6 md:p-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">Get started</h1>
          <p className="text-balance text-muted-foreground">
            Create your account now
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Hasbiy Robbiy"
            required
            defaultValue={state?.input?.full_name}
          />
          {state?.error?.full_name && (
            <span className="text-sm text-destructive">
              {state.error.full_name[0]}
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            defaultValue={state?.input?.email}
          />
          {state?.error?.email && (
            <span className="text-sm text-destructive">
              {state.error.email[0]}
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            defaultValue={state?.input?.password}
          />
          {state?.error?.password && (
            <span className="text-sm text-destructive">
              {state.error.password[0]}
            </span>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          Register {isPending && <Loader className="animate-spin" />}
        </Button>
        <div className="text-center text-sm">
          Already have an account?&nbsp;
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
}
