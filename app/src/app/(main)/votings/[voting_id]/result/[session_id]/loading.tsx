import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="space-y-4 p-4 pt-0">
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Voting Result</h2>

        <Skeleton className="h-7 w-full max-w-44" />
      </div>

      {/* Contents */}
      <div className="flex w-full flex-col gap-4 lg:flex-row">
        <Skeleton className="aspect-video w-full lg:max-h-[250px]" />

        <Skeleton className="aspect-square w-full lg:max-h-[250px]" />
      </div>
    </div>
  );
}
