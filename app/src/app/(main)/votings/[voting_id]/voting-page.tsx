"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TVoting } from "@/types/model";
import Link from "next/link";
import { useSupabase } from "@/utils/supabase/client";
import { useGetAuth } from "@/hooks/auth/use-auth";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useGetVotingById } from "@/hooks/votings/use-get-votings";
import { Badge } from "@/components/ui/badge";
import VotingDropdown from "@/components/voting/voting-dropdown";

type Props = {
  data: TVoting;
};

export default function VotingPage({ data }: Props) {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const { data: votingData } = useGetVotingById(supabase, data.id, data);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link href="/votings">Votings/Awards</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex-1 p-4 pt-0">
        <div className="flex items-start gap-4">
          <DynamicIcon name={data.icon as IconName} size={56} />
          <div className="5 space-y-1">
            <p className="text-xl font-bold">{data.name}</p>
            <Badge variant={votingData.is_open ? "default" : "secondary"}>
              {votingData.is_open ? "open" : "closed"}
            </Badge>
          </div>
          {user?.id === votingData.user_id && (
            <div className="ml-auto">
              <VotingDropdown data={votingData} />
            </div>
          )}
        </div>
        <p className="mt-4 text-pretty text-sm text-muted-foreground">
          {data.description}
        </p>
      </div>
    </>
  );
}
