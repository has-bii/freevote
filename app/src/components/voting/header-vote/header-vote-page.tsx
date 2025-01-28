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
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DynamicIconn from "../../dynamic-icon";
import { actionGetParticipants } from "@/hooks/participants/action-get-participants";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function HeaderVotePage({ params }: Props) {
  const { voting_id } = await params;

  const supabase = await createClient();

  const fetchVoting = supabase
    .from("votings")
    .select("*")
    .eq("id", voting_id)
    .single();

  const fetchUser = supabase.auth.getUser();

  const fetchParticipant = actionGetParticipants(voting_id);

  const [
    { data: votingData, error: er1 },
    {
      data: { user },
    },
    { data: participants, error: er2 },
  ] = await Promise.all([fetchVoting, fetchUser, fetchParticipant]);

  if (er1 || er2 !== null) redirect("/votings");

  const isParticipant = participants.find((p) => p.user_id === user?.id);
  const isOwner = votingData.user_id === user?.id;

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
              <Badge variant={votingData?.is_open ? "default" : "secondary"}>
                {votingData?.is_open ? "open" : "closed"}
              </Badge>

              {isParticipant && <Badge variant="secondary">joined</Badge>}
              {isOwner && <Badge variant="secondary">owner</Badge>}
            </div>
          </div>

          {votingData && (
            <div className="ml-auto">
              <VotingDropdown
                data={votingData}
                isOwner={isOwner}
                isParticipant={isParticipant}
              />
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
              participants={participants.length}
              user={user!}
            />
          </div>
        </React.Suspense>
      </div>
    </>
  );
}
