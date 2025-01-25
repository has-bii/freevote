"use client";

import React from "react";
import QueryProvider from "./query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ProgressBar, ProgressBarProvider } from "react-transition-progress";

type Props = {
  children: React.ReactNode;
};

export default function RootProvider({ children }: Props) {
  return (
    <>
      <QueryProvider>
        <ProgressBarProvider>
          <ProgressBar className="fixed top-0 z-50 h-1 bg-black" />
          {children}
        </ProgressBarProvider>
      </QueryProvider>
      <Toaster richColors />
    </>
  );
}
