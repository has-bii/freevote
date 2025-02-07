import { TProfile, TVoting } from "@/types/model"
import React from "react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { format } from "date-fns"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Props = {
  data: TVoting & {
    profiles: Pick<TProfile, "full_name" | "avatar">
  }
}

export default function PublicVotingOverview({
  data: { name, is_open, description, created_at, id, profiles },
}: Props) {
  return (
    <Link href={`/votings/${id}/vote`}>
      <Card>
        <CardHeader>
          <div className="inline-flex items-center gap-2">
            <CardTitle>{name}</CardTitle>
            <Badge variant={is_open ? "default" : "secondary"}>
              {is_open ? "open" : "closed"}
            </Badge>
          </div>
          <CardDescription className="lg:max-w-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-between">
          <div className="inline-flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profiles.avatar ?? undefined} />
              <AvatarFallback className="text-sm">
                {profiles.full_name
                  .split(" ")
                  .map((c) => c[0].toUpperCase())
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{profiles.full_name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(created_at, "PPP")}
          </p>
        </CardFooter>
      </Card>
    </Link>
  )
}
