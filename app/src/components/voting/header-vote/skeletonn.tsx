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
import { Loader, Vote, Sparkles } from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const navs = [
  {
    name: "vote",
    icon: Vote,
  },
  {
    name: "choices",
    icon: Sparkles,
  },
];

export default function Skeletonn() {
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
                <BreadcrumbPage>
                  <Skeleton className="h-4 w-32" />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="p-4 pt-0">
        <div className="flex items-start gap-4">
          <div className="flex w-fit">
            <Loader className="shrink-0 animate-spin" size={56} />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-60" />

            <div className="inline-flex gap-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="mt-4">
          <nav className="flex max-w-full flex-nowrap items-center gap-2 overflow-hidden overflow-x-auto border-b pb-2">
            {navs.map((nav) => (
              <Button key={nav.name} className="capitalize" variant="ghost">
                <nav.icon />
                {nav.name}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
