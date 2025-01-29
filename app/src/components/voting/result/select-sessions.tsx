"use client";

import { TSession } from "@/types/model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  voting_id: string;
  data: TSession[] | null;
  current: string;
  error?: string;
};

export default function SelectSessions({
  data,
  error,
  current,
  voting_id,
}: Props) {
  const router = useRouter();

  if (error || data === null)
    return (
      <div className="max-w-[180px] rounded-xl border border-destructive px-3 py-1">
        <p className="truncate text-sm text-destructive" title={error}>
          {error ?? "Failed to get sessions data"}
        </p>
      </div>
    );

  return (
    <Select
      defaultValue={current}
      onValueChange={(v) => {
        router.push(`/votings/${voting_id}/result/${v}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a session" />
      </SelectTrigger>
      <SelectContent>
        {data.map(({ id, name }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
