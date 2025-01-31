"use server";

import { TParticipant, TProfile } from "@/types/model";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type TResponseParticipantById =
  | {
      data: (TParticipant & {
        profiles: Pick<TProfile, "full_name" | "avatar">;
      })[];
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export const getParticipantCached = async (
  voting_id: string,
): Promise<TResponseParticipantById> =>
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/participant/${voting_id}`, {
    headers: {
      Cookie: (await cookies()).toString(),
    },
    next: {
      revalidate: 3600,
      tags: [`participant ${voting_id}`],
    },
  }).then((res) => res.json());

export const revalidateParticipant = async (voting_id: string) =>
  revalidateTag(`participant ${voting_id}`);
