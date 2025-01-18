import React from "react";
import QueryProvider from "./query-provider";
import { Toaster } from "@/components/ui/sonner";

type Props = {
  children: React.ReactNode;
};

export default function RootProvider({ children }: Props) {
  return (
    <>
      <QueryProvider>{children}</QueryProvider>
      <Toaster richColors />
    </>
  );
}
