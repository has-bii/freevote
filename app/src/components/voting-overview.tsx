import { TVoting } from "@/types/model";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type Props = {
  data: TVoting;
};

export default function VotingOverview({ data }: Props) {
  return (
    <Link
      href={`/votings/${data.id}`}
      role="link"
      className="flex h-28 w-full flex-col rounded-lg border px-4 py-3"
    >
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 truncate">
          <DynamicIcon name={data.icon as IconName} size={20} />
          <p className="flex-1 truncate text-sm font-medium" title={data.name}>
            {data.name}
          </p>
        </div>

        <Badge variant={data.is_open ? "default" : "secondary"}>
          {data.is_open ? "open" : "closed"}
        </Badge>
      </div>

      <span className="mt-0.5 text-xs text-muted-foreground">
        {format(data.created_at, "PPP")}
      </span>
    </Link>
  );
}
