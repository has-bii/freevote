"use client";

import React from "react";
import QueryProvider from "./query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider";

type Props = {
  children: React.ReactNode;
};

export default function RootProvider({ children }: Props) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors />
      </ThemeProvider>
    </>
  );
}
