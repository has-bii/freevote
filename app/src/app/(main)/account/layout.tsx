"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const navs = [
  {
    name: "Profile",
    href: "/account/profile",
  },
  {
    name: "Privacy",
    href: "/account/privacy",
  },
];

export default function AccountLayout({ children }: Props) {
  const pathname = usePathname();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Account</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Account</h2>
          <p className="text-muted-foreground">manage your account settings.</p>
        </div>
        <Separator orientation="horizontal" role="none" />
        <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
          <aside className="lg:w-1/5">
            <nav className="flex lg:flex-col">
              {navs.map(({ href, name }) => (
                <Link
                  href={href}
                  key={name}
                  className={cn(
                    buttonVariants({
                      variant: href === pathname ? "ghost" : "link",
                      className: "justify-start",
                    }),
                    href === pathname
                      ? "bg-accent text-accent-foreground"
                      : undefined,
                  )}
                >
                  {name}
                </Link>
              ))}
            </nav>
          </aside>
          {children}
        </div>
      </div>
    </>
  );
}
