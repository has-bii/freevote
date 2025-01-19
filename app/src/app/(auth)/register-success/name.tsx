"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

export default function Name() {
  const searchParams = useSearchParams();

  return (
    <h1 className="text-4xl font-bold">
      Welcome, {searchParams.get("name")}! 🎉
    </h1>
  );
}
