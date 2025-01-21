"use client";

import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSupabase } from "@/utils/supabase/client";
import { useGetVotings } from "@/hooks/votings/use-get-votings";
import Link from "next/link";
import AddVoting from "./voting/add-voting";
import { useDeleteVoting } from "../hooks/votings/use-modal-delete-voting";

export function NavVotings() {
  const { isMobile } = useSidebar();
  const supabase = useSupabase();
  const { data: votings } = useGetVotings(supabase);
  const { open } = useDeleteVoting();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Votings/Awards</SidebarGroupLabel>
      <SidebarMenu>
        {votings === undefined
          ? ""
          : votings?.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link href={`/votings/${item.id}`}>
                    <DynamicIcon name={item.icon as IconName} />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        open(item);
                      }}
                    >
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
        <SidebarMenuItem>
          <AddVoting>
            <SidebarMenuButton className="text-sidebar-foreground">
              <Plus className="text-sidebar-foreground" />
              <span>Add Voting</span>
            </SidebarMenuButton>
          </AddVoting>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
