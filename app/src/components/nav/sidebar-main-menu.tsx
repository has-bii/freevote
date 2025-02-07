"use client"

import React from "react"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Globe, HomeIcon, VoteIcon } from "lucide-react"

export default function SidebarMainMenu() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === "/"}>
            <Link
              href="/"
              onClick={() => setOpenMobile(false)}
              className="truncate"
            >
              <HomeIcon />
              Getting Started
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === "/"}>
            <Link
              href="/public"
              onClick={() => setOpenMobile(false)}
              className="truncate"
            >
              <Globe />
              Public Votings
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === "/votings"}>
            <Link
              href="/votings"
              onClick={() => setOpenMobile(false)}
              className="truncate"
            >
              <VoteIcon />
              My Votings
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
