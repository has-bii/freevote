"use server";

import { TSession } from "@/types/model";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type TResponseGetSessions =
  | {
      data: TSession[];
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export const getSessionCached = async (
  voting_id: string,
): Promise<TResponseGetSessions> =>
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/session/${voting_id}`, {
    headers: {
      Cookie: (await cookies()).toString(),
    },
    next: {
      revalidate: 3600,
      tags: [`session ${voting_id}`],
    },
  }).then((res) => res.json());

export const revalidateSession = async (voting_id: string) =>
  revalidateTag(`session ${voting_id}`);
