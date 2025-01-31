"use client";

import React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import AddVoting from "@/components/add-voting";
import { Plus } from "lucide-react";
import NavVotingsMenu from "./nav-votings-menu";
import { useSupabase } from "@/utils/supabase/client";
import { useGetVotings } from "@/hooks/votings/use-get-votings";
import NavVotingsSkeleton from "./nav-votings-skeleton";

export default function NavVotings() {
  const supabase = useSupabase();
  const { data: votings, isLoading, error } = useGetVotings(supabase);

  if (isLoading || error) return <NavVotingsSkeleton />;

  return (
    <SidebarMenu>
      {votings && <NavVotingsMenu data={votings} />}
      <SidebarMenuItem>
        <AddVoting>
          <SidebarMenuButton className="text-sidebar-foreground">
            <Plus className="text-sidebar-foreground" />
            <span>Add Voting</span>
          </SidebarMenuButton>
        </AddVoting>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
