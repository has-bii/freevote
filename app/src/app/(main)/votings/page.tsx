"use client";

import React from "react";
import { useSupabase } from "@/utils/supabase/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AddVoting from "@/components/add-voting";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import JoinVoting from "@/components/voting/join-voting";
import {
  useGetJoinedVotings,
  useGetVotings,
} from "@/hooks/votings/use-get-votings";
import VotingOverview from "@/components/voting-overview";

export default function Page() {
  const supabase = useSupabase();
  const { data: createdVotings } = useGetVotings(supabase);
  const { data: joinedVotings } = useGetJoinedVotings(supabase);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Votings/Awards</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex-1 p-4 pt-0">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold lg:text-2xl">My Votings/Awards</h1>
          <AddVoting>
            <Button size="sm">Add new</Button>
          </AddVoting>
          <JoinVoting />
        </div>

        {/* Created */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-lg font-medium">Created</span>
          <Separator orientation="horizontal" className="flex-1" />
        </div>
        <div className="mt-2 grid flex-1 gap-2 lg:grid-cols-5">
          {createdVotings === undefined ? (
            <Skeleton className="h-28 w-full" />
          ) : createdVotings.length === 0 ? (
            <div className="flex h-28 items-center justify-center rounded-lg border lg:col-span-5">
              <p className="text-sm text-muted-foreground">
                You don&apos;t have created votings.
              </p>
            </div>
          ) : (
            createdVotings.map((d) => <VotingOverview key={d.id} data={d} />)
          )}
        </div>

        {/* Joined */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-lg font-medium">Joined</span>
          <Separator orientation="horizontal" className="flex-1" />
        </div>
        <div className="mt-2 grid flex-1 gap-2 lg:grid-cols-5">
          {joinedVotings === undefined ? (
            <Skeleton className="h-28 w-full" />
          ) : joinedVotings.length === 0 ? (
            <div className="flex h-28 items-center justify-center rounded-lg border lg:col-span-5">
              <p className="text-sm text-muted-foreground">
                You don&apos;t have joined votings.
              </p>
            </div>
          ) : (
            joinedVotings.map((d) => <VotingOverview key={d.id} data={d} />)
          )}
        </div>
      </div>
    </>
  );
}
