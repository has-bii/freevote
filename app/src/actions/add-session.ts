"use server";

import { description, stringAlphabetNumber } from "@/lib/form-schema";
import { TSession } from "@/types/model";
import { createClient } from "@/utils/supabase/server";
import { isPast } from "date-fns";
import { z } from "zod";

const SessionSchema = z.object({
  voting_id: z.string().uuid("Invalid ID"),
  name: stringAlphabetNumber,
  description: description,
  choices: z.array(z.string().uuid()).min(2, "Min. 2 choices"),
  session_start_at: z.string().datetime(),
  session_end_at: z
    .string()
    .datetime()
    .refine((v) => !isPast(v), "Invalid date time"),
});

type TResponse =
  | {
      error: string;
      data: null;
    }
  | {
      error: null;
      data: TSession;
    };

export const actionAddSession = async (
  formData: FormData,
): Promise<TResponse> => {
  try {
    const supabase = await createClient();

    const payload = {
      voting_id: formData.get("voting_id"),
      name: formData.get("name"),
      description: formData.get("description"),
      choices: formData.getAll("choices"),
      session_start_at: formData.get("session_start_at"),
      session_end_at: formData.get("session_end_at"),
    };

    const { error, data: parsedData } = SessionSchema.safeParse(payload);

    if (error) {
      console.log("Error: ", error);
      return { data: null, error: "Invalid data" };
    }

    const { error: errorInsert, data: newData } = await supabase
      .from("sessions")
      .insert(parsedData)
      .select("*")
      .single();

    if (errorInsert) return { data: null, error: errorInsert.message };

    return { error: null, data: newData };
  } catch (error) {
    console.error("Failed to add new session: ", error);
    return { data: null, error: "Internal server error!" };
  }
};
