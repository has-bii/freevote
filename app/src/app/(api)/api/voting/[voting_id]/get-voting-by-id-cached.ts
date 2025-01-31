"use server";

import { TVoting } from "@/types/model";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type TResponseVotingById =
  | {
      data: TVoting;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export const getVotingByIdCached = async (
  voting_id: string,
): Promise<TResponseVotingById> =>
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/voting/${voting_id}`, {
    headers: {
      Cookie: (await cookies()).toString(),
    },
    next: {
      revalidate: 3600,
      tags: [`voting ${voting_id}`],
    },
  }).then((res) => res.json());

export const revalidateVoting = async (voting_id: string) =>
  revalidateTag(`voting ${voting_id}`);
