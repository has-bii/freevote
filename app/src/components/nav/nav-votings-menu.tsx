"use client";

import { TVoting } from "@/types/model";
import React from "react";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import Link from "next/link";
import DynamicIconn from "../dynamic-icon";
import { IconName } from "lucide-react/dynamic";

type Props = {
  data: TVoting[];
};

export default function NavVotingsMenu({ data }: Props) {
  const { setOpenMobile } = useSidebar();

  return data.map((item) => (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton asChild>
        <Link
          href={`/votings/${item.id}/vote`}
          onClick={() => setOpenMobile(false)}
          title={item.name}
          prefetch
        >
          <DynamicIconn name={item.icon as IconName} />
          <span>{item.name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));
}
