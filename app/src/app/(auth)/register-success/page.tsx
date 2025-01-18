"use client";

import React from "react";
import { ArrowLeft, CheckIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function SuccessRegisterPage() {
  const searchParams = useSearchParams();

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4">
      <div className="animate-bounce rounded-full bg-green-400 p-4 text-white">
        <CheckIcon strokeWidth={6} />
      </div>
      <h1 className="text-4xl font-bold">
        Welcome, {searchParams.get("name")}! 🎉
      </h1>
      <p className="text-muted-foreground text-sm">
        We&apos;re thrilled to have you join us! Let&apos;s get started.
      </p>
      <div className="w-fit rounded-lg border border-green-400 bg-green-50 p-4 text-sm text-green-500">
        Please check your email to verify your account.
      </div>
      <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
        <ArrowLeft />
        Back
      </Link>
    </div>
  );
}
