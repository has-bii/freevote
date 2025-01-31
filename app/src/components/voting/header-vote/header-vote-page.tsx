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
import { IconName } from "lucide-react/dynamic";
import { Badge } from "@/components/ui/badge";
import VotingDropdown from "@/components/voting/voting-dropdown";
import VotingPageNav from "@/components/voting/voting-page-nav";
import DynamicIconn from "../../dynamic-icon";
import ParticipantOwnerBadge from "@/components/participant-owner-badge";
import { TParticipant, TProfile, TVoting } from "@/types/model";
import { useSupabase } from "@/utils/supabase/client";
import { useGetVotingById } from "@/hooks/votings/use-get-votings";
import { useGetParticipants } from "@/hooks/participants/use-get-participants";

type Props = {
  voting_id: string;
  initialData: {
    voting: TVoting;
    participants: Array<
      TParticipant & { profiles: Pick<TProfile, "full_name" | "avatar"> }
    >;
  };
};

export default function HeaderVotePage({ initialData, voting_id }: Props) {
  const { participants, voting } = initialData;
  const supabase = useSupabase();
  const { data: votingData } = useGetVotingById({
    supabase,
    id: voting_id,
    initialData: voting,
  });
  const { data: participantsData } = useGetParticipants({
    initialData: participants,
    id: voting_id,
  });

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
            <div className="flex w-fit">
              <DynamicIconn
                name={votingData.icon as IconName}
                className="shrink-0"
                size={56}
              />
            </div>
          )}
          <div className="space-y-1">
            <p
              className="line-clamp-2 text-xl font-bold"
              title={votingData.name}
            >
              {votingData.name}
            </p>
            <div className="inline-flex gap-2">
              <Badge variant={votingData.is_open ? "default" : "secondary"}>
                {votingData.is_open ? "open" : "closed"}
              </Badge>

              <ParticipantOwnerBadge
                owner_id={votingData.user_id}
                participants={participants}
              />
            </div>
          </div>

          {votingData && (
            <div className="ml-auto">
              <VotingDropdown data={votingData} participants={participants} />
            </div>
          )}
        </div>
        <p className="mt-4 text-pretty text-sm text-muted-foreground">
          {votingData?.description}
        </p>

        <React.Suspense>
          <div className="mt-4">
            <VotingPageNav
              id={voting_id}
              owner_id={votingData.user_id}
              participants={participantsData.length}
            />
          </div>
        </React.Suspense>
      </div>
    </>
  );
}
