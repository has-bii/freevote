"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min. 8 characters!"),
});

export type LoginActionInitState = {
  error?: string;
  input?: {
    email?: string;
  };
};

export async function login(
  _: LoginActionInitState | null,
  formData: FormData,
): Promise<LoginActionInitState> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: parsedData, error } = FormSchema.safeParse(data);

  if (error)
    return {
      error: "Invalid input!",
    };

  const { error: loginError } =
    await supabase.auth.signInWithPassword(parsedData);

  if (loginError) {
    return {
      error: loginError.message,
      input: {
        email: parsedData.email,
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
