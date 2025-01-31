"use server";

import { TResult } from "@/types/model";
import { createService } from "@/utils/supabase/service";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type TResponseGetResults =
  | {
      data: TResult;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export const getResultCached = async (
  session_id: string,
): Promise<TResponseGetResults> =>
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/result/${session_id}`, {
    headers: {
      Cookie: (await cookies()).toString(),
    },
    next: {
      revalidate: 3600,
      tags: [`result ${session_id}`],
    },
  }).then((res) => res.json());

export const revalidateResult = async (session_id: string) =>
  revalidateTag(`result ${session_id}`);

export const revalidateResultByVotingId = async (voting_id: string) => {
  const service = createService();

  const { data } = await service
    .from("sessions")
    .select("id")
    .eq("voting_id", voting_id);

  if (data) {
    data.forEach((d) => revalidateTag(`result ${d.id}`));
  }
};
