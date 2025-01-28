"use client";

import { LucideIcon, Sparkles, Users, Vote } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { User } from "@supabase/supabase-js";

type Props = {
  id: string;
  owner_id: string;
  participants: number;
  user: User;
};

export default function VotingPageNav({
  id,
  owner_id,
  participants,
  user,
}: Props) {
  const [navs, setNavs] = React.useState<
    Array<{ name: string; icon: LucideIcon; data?: string }>
  >([
    {
      name: "vote",
      icon: Vote,
    },
    {
      name: "choices",
      icon: Sparkles,
    },
  ]);
  const pathname = usePathname();

  React.useEffect(() => {
    if (user && user.id === owner_id)
      setNavs([
        {
          name: "vote",
          icon: Vote,
        },
        {
          name: "participants",
          icon: Users,
          data: participants.toString(),
        },
        {
          name: "choices",
          icon: Sparkles,
        },
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="flex max-w-full flex-nowrap items-center gap-2 overflow-hidden overflow-x-auto border-b pb-2">
      {navs.map((nav) => (
        <Button
          key={nav.name}
          asChild
          variant={
            pathname === `/votings/${id}/${nav.name}` ? "secondary" : "ghost"
          }
        >
          <Link href={`/votings/${id}/${nav.name}`} className="capitalize">
            <nav.icon />
            {nav.name}
            {nav.data && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-1 text-xs text-white">
                {nav.data}
              </span>
            )}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
