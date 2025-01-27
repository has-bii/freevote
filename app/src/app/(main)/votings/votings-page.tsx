"use client";

import React from "react";
import { useGetVotings } from "@/hooks/votings/use-get-votings";
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
import { TVoting } from "@/types/model";
import VotingOverview from "@/components/voting-overview";

type Props = {
  initialData: {
    created: TVoting[];
    joined: TVoting[];
  };
};

export default function VotingsPage({ initialData: { created } }: Props) {
  const supabase = useSupabase();
  const { data: createdVotings } = useGetVotings(supabase, created);

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

        <div className="mt-6 grid flex-1 gap-2 lg:grid-cols-5">
          {createdVotings === undefined ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))
          ) : createdVotings.length === 0 ? (
            <div className="flex h-28 items-center justify-center rounded-lg border lg:col-span-5">
              <p className="text-muted-foreground">
                You don&apos;t have any active voting or joined votes.
              </p>
            </div>
          ) : (
            createdVotings.map((d) => <VotingOverview key={d.id} data={d} />)
          )}
        </div>
      </div>
    </>
  );
}
