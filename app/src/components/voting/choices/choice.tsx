import { TChoice } from "@/types/model";
import React from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Link2, Pencil, Trash2 } from "lucide-react";
import EditChoice from "./edit-choice";
import RemoveChoice from "./remove-choice";
import { Button } from "@/components/ui/button";

type Props = {
  data: TChoice;
  isOwner: boolean;
};

export default function Choice({ data, isOwner }: Props) {
  return (
    <Card className="flex items-start gap-4 p-6">
      {/* Image */}
      {data.image && (
        <figure className="relative aspect-square h-28 w-28 shrink-0 overflow-hidden rounded-lg">
          <Image
            alt={data.name}
            src={data.image}
            fill
            className="object-cover"
          />
        </figure>
      )}

      {/* Content */}
      <div className="flex min-h-28 flex-col gap-1.5">
        <CardTitle className="line-clamp-2" title={data.name}>
          {data.name}
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {data.description}
        </CardDescription>
        {data.link && (
          <Link
            href={data.link}
            className="flex items-center gap-2 text-sm hover:underline [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            role="link"
          >
            <Link2 />
            {data.link}
          </Link>
        )}
        {/* Actions */}
        <div className="mt-auto flex w-full gap-2">
          {isOwner && (
            <>
              <EditChoice data={data}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 md:w-fit md:flex-none"
                >
                  <Pencil className="size-4" />
                  <span className="hidden lg:block">Edit</span>
                </Button>
              </EditChoice>
              <RemoveChoice data={data}>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 md:w-fit md:flex-none"
                >
                  <Trash2 className="size-4" />
                  <span className="hidden lg:block">Delete</span>
                </Button>
              </RemoveChoice>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
