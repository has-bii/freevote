"use client";

import { TVoting } from "@/types/model";
import React from "react";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import DynamicIconn from "../dynamic-icon";
import { IconName } from "lucide-react/dynamic";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useDeleteVoting } from "@/hooks/votings/use-modal-delete-voting";

type Props = {
  data: TVoting[];
};

export default function NavVotingsMenu({ data }: Props) {
  const { open: openDeleteModal } = useDeleteVoting();
  const { isMobile, setOpenMobile } = useSidebar();

  return data.map((item) => (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton asChild>
        <Link href={`/votings/${item.id}`} onClick={() => setOpenMobile(false)}>
          <DynamicIconn name={item.icon as IconName} />
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
              openDeleteModal(item);
            }}
          >
            <Trash2 className="text-muted-foreground" />
            <span>Delete Project</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  ));
}
