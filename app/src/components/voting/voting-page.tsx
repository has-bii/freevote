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
import Link from "next/link";
import { useSupabase } from "@/utils/supabase/client";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useGetVotingById } from "@/hooks/votings/use-get-votings";
import { Badge } from "@/components/ui/badge";
import VotingDropdown from "@/components/voting/voting-dropdown";
import VotingPageNav from "@/components/voting/voting-page-nav";

type Props = {
  voting_id: string;
};

export default function VotingPage({ voting_id }: Props) {
  const supabase = useSupabase();
  const { data: votingData } = useGetVotingById(supabase, voting_id);

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
                <BreadcrumbPage>{votingData?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="p-4 pt-0">
        <div className="flex items-start gap-4">
          {votingData && (
            <DynamicIcon name={votingData.icon as IconName} size={56} />
          )}
          <div className="5 space-y-1">
            <p className="text-xl font-bold">{votingData?.name}</p>
            <Badge variant={votingData?.is_open ? "default" : "secondary"}>
              {votingData?.is_open ? "open" : "closed"}
            </Badge>
          </div>

          {votingData && (
            <div className="ml-auto">
              <VotingDropdown data={votingData} />
            </div>
          )}
        </div>
        <p className="mt-4 text-pretty text-sm text-muted-foreground">
          {votingData?.description}
        </p>

        <React.Suspense>
          <div className="mt-4">
            <VotingPageNav id={voting_id} />
          </div>
        </React.Suspense>
      </div>
    </>
  );
}
