"use client";

import { Sparkles, Users, Vote } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const navs = [
  {
    name: "vote",
    icon: Vote,
  },
  {
    name: "participants",
    icon: Users,
  },
  {
    name: "choices",
    icon: Sparkles,
  },
];

type Props = {
  id: string;
};

export default function VotingPageNav({ id }: Props) {
  const pathname = usePathname();

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
          </Link>
        </Button>
      ))}
    </nav>
  );
}
