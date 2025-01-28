"use client";

import { Loader, LucideProps } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import React from "react";

type Props = {
  name: IconName;
} & LucideProps;

export default function DynamicIconn({ name, ...props }: Props) {
  return (
    <DynamicIcon
      name={name}
      fallback={() => <Loader className="animate-spin" {...props} />}
      {...props}
    />
  );
}
