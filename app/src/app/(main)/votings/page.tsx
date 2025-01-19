"use client";

import React from "react";
import { useGetJoinedVotes } from "@/hooks/votings/use-get-votings";
import { useSupabase } from "@/utils/supabase/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AddVoting from "@/components/voting/add-voting";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAuth } from "@/hooks/auth/use-auth";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { format } from "date-fns";
import Link from "next/link";
import JoinVoting from "@/components/voting/join-voting";

export default function Page() {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);
  const { data } = useGetJoinedVotes(supabase);

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
          {data === undefined ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))
          ) : data.length === 0 ? (
            <div className="flex h-28 items-center justify-center rounded-lg border lg:col-span-5">
              <p className="text-muted-foreground">
                You don&apos;t have any active voting or joined votes.
              </p>
            </div>
          ) : (
            data.map(
              ({ id, is_open, name, icon, profiles, user_id, created_at }) => (
                <Link
                  key={id}
                  href={`/votings/${id}`}
                  role="link"
                  className="flex h-28 w-full flex-col rounded-lg border px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 truncate">
                      <DynamicIcon name={icon as IconName} size={20} />
                      <p
                        className="flex-1 truncate text-sm font-medium"
                        title={name}
                      >
                        {name}
                      </p>
                    </div>

                    <Badge variant={is_open ? "default" : "secondary"}>
                      {is_open ? "open" : "closed"}
                    </Badge>
                  </div>

                  <span className="mt-0.5 text-xs text-muted-foreground">
                    {format(created_at, "PPP")}
                  </span>

                  <div className="mt-auto inline-flex items-end justify-between">
                    <Badge variant="default" className="w-fit">
                      {`@${user_id === user?.id ? "yours" : profiles.full_name.toLowerCase()}`}
                    </Badge>
                  </div>
                </Link>
              ),
            )
          )}
        </div>
      </div>
    </>
  );
}
