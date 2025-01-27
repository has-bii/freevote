import { TChoice } from "@/types/model";
import React from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Link2, Pencil, Trash2 } from "lucide-react";
import EditChoice from "./edit-choice";
import RemoveChoice from "./remove-choice";

type Props = {
  data: TChoice;
  isOwner: boolean;
};

export default function Choice({ data, isOwner }: Props) {
  return (
    <Card className="flex items-start justify-between gap-4 p-6">
      {/* Content */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <CardTitle>{data.name}</CardTitle>
          <Badge
            variant="outline"
            className="flex items-center gap-1"
            style={{ color: data.color, borderColor: data.color }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            Color
          </Badge>
          {isOwner && (
            <>
              <EditChoice data={data}>
                <Badge
                  className="flex items-center gap-2"
                  variant="secondary"
                  role="button"
                >
                  <Pencil className="size-4" />
                  <span className="hidden lg:block">Edit</span>
                </Badge>
              </EditChoice>
              <RemoveChoice data={data}>
                <Badge
                  className="flex items-center gap-2"
                  variant="destructive"
                  role="button"
                >
                  <Trash2 className="size-4" />
                  <span className="hidden lg:block">Delete</span>
                </Badge>
              </RemoveChoice>
            </>
          )}
        </div>
        <CardDescription>{data.description}</CardDescription>
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
      </div>

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
    </Card>
  );
}
