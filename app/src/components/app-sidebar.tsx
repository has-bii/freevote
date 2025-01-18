"use client";

import * as React from "react";
import { HomeIcon } from "lucide-react";

import { NavVotings } from "@/components/nav-votings";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSupabase } from "@/utils/supabase/client";
import { useGetAuth } from "@/hooks/auth/use-auth";
import Logo from "@/components/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link href="/">
                  <HomeIcon />
                  Getting Started
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavVotings />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
