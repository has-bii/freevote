import { TVoting } from "@/types/model";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";

type Props = {
  data: TVoting;
};

export default function VotingOverview({ data }: Props) {
  return (
    <Link
      href={`/votings/${data.id}/vote`}
      role="link"
      className="flex h-28 w-full flex-col space-y-2 rounded-xl border px-4 py-3 shadow"
      prefetch
    >
      <div className="flex items-center justify-between gap-2">
        <DynamicIcon name={data.icon as IconName} size={20} />
        <p className="flex-1 truncate text-sm font-medium" title={data.name}>
          {data.name}
        </p>

        <Badge variant={data.is_open ? "default" : "secondary"}>
          {data.is_open ? "open" : "closed"}
        </Badge>
      </div>

      <p className="line-clamp-3 text-pretty text-justify text-xs text-muted-foreground">
        {data.description}
      </p>
    </Link>
  );
}
