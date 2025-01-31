"use server";

import { TChoice } from "@/types/model";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type TResponseGetChoices =
  | {
      data: TChoice[];
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export const getChoiceCached = async (
  voting_id: string,
): Promise<TResponseGetChoices> =>
  fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/choice/${voting_id}`, {
    headers: {
      Cookie: (await cookies()).toString(),
    },
    next: {
      revalidate: 3600,
      tags: [`choice ${voting_id}`],
    },
  }).then((res) => res.json());

export const revalidateChoice = async (voting_id: string) =>
  revalidateTag(`choice ${voting_id}`);
