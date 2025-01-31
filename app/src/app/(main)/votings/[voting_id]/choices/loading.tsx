import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="space-y-4 p-4 pt-0">
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Choices</h2>
      </div>

      {/* Contents */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    </div>
  );
}
