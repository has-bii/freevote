import * as React from "react";

import { NavUser } from "@/components/nav/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/components/logo";
import SidebarMainMenu from "./sidebar-main-menu";
import NavVotingsSkeleton from "./nav-votings-skeleton";
import NavVotings from "./nav-votings";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        {/* Main */}
        <SidebarMainMenu />

        {/* Votings */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Votings</SidebarGroupLabel>
          <React.Suspense fallback={<NavVotingsSkeleton />}>
            <NavVotings />
          </React.Suspense>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
