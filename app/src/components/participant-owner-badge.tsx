"use client";

import { useGetAuth } from "@/hooks/auth/use-auth";
import { TParticipant } from "@/types/model";
import { useSupabase } from "@/utils/supabase/client";
import React from "react";
import { Badge } from "./ui/badge";

type Props = {
  participants: TParticipant[];
  owner_id: string;
};

export default function ParticipantOwnerBadge({
  participants,
  owner_id,
}: Props) {
  const supabase = useSupabase();
  const { data: user } = useGetAuth(supabase);

  // Check if user is a participant
  const isParticipant = React.useMemo(() => {
    if (!user) return false;

    return participants.find((p) => p.user_id === user.id);
  }, [participants, user]);

  // Check if user is the owner
  const isOwner = React.useMemo(() => {
    if (!user) return false;

    return owner_id === user.id;
  }, [owner_id, user]);

  if (isOwner) return <Badge variant="secondary">owner</Badge>;

  if (isParticipant) return <Badge variant="secondary">joined</Badge>;
}
