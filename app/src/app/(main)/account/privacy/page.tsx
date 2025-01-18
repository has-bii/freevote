"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import ChangePasswordForm from "@/components/change-password-form";
import ChangeEmailForm from "@/components/change-email-form";

export default function PrivacyPage() {
  return (
    <div className="w-full flex-1 lg:max-w-2xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Privacy</h3>
          <p className="text-sm text-muted-foreground">
            Change your password and email.
          </p>
        </div>
        <Separator orientation="horizontal" />
        <ChangeEmailForm />
        <Separator orientation="horizontal" />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
