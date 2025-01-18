import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DeleteVoting from "@/components/voting/delete/delete-voting";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
        <DeleteVoting />
      </SidebarInset>
    </SidebarProvider>
  );
}
