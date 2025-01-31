import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="space-y-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sessions List</h2>
      </div>

      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
