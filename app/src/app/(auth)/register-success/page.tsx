import React from "react";
import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Name from "./name";

export default function SuccessRegisterPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4">
      <div className="animate-bounce rounded-full bg-green-400 p-4 text-white">
        <CheckIcon strokeWidth={6} />
      </div>
      <React.Suspense>
        <Name />
      </React.Suspense>
      <p className="text-sm text-muted-foreground">
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
