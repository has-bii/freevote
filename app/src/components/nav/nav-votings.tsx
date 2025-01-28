import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import AddVoting from "@/components/add-voting";
import { Plus } from "lucide-react";
import NavVotingsMenu from "./nav-votings-menu";

export default async function NavVotings() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: votings } = await supabase
    .from("votings")
    .select("*")
    .eq("user_id", user.id);

  return (
    <SidebarMenu>
      <NavVotingsMenu data={votings ?? []} />
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
