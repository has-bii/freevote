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
import { Link } from "react-transition-progress/next";
import { useSupabase } from "@/utils/supabase/client";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { useGetVotingById } from "@/hooks/votings/use-get-votings";
import { Badge } from "@/components/ui/badge";
import VotingDropdown from "@/components/voting/voting-dropdown";
import VotingPageNav from "@/components/voting/voting-page-nav";
import { useQueryClient } from "@tanstack/react-query";
import { TVoting } from "@/types/model";
import { format } from "date-fns";

type Props = {
  voting_id: string;
};

export default function VotingPage({ voting_id }: Props) {
  const supabase = useSupabase();
  const query = useQueryClient();
  const { data: votingData } = useGetVotingById(supabase, voting_id);

  React.useEffect(() => {
    const channel = supabase
      .channel(`realtime voting ${voting_id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "votings",
        },
        ({ new: newData }: { new: TVoting }) => {
          query.setQueryData<TVoting>(["voting", voting_id], () => newData);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [query, supabase, voting_id]);

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

        {votingData?.is_start && (
          <div className="mt-4 flex w-fit items-center gap-4">
            <div className="inline-flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="outline" className="inline-flex gap-1">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Started
              </Badge>
            </div>

            {votingData.expired_session && (
              <div className="inline-flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Stopped at
                </span>
                <Badge variant="default">
                  {format(votingData.expired_session, "PP p")}
                </Badge>
              </div>
            )}
          </div>
        )}

        <React.Suspense>
          <div className="mt-4">
            <VotingPageNav id={voting_id} />
          </div>
        </React.Suspense>
      </div>
    </>
  );
}
