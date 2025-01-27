"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { email, full_name, password } from "@/lib/form-schema";

const signupSchema = z.object({
  full_name: full_name,
  email: email,
  password: password,
});

type Response = {
  error?: {
    full_name?: string[] | undefined;
    email?: string[] | undefined;
    password?: string[] | undefined;
  };
  success: boolean;
  message?: string;
  input?: {
    full_name?: string;
    email?: string;
    password?: string;
  };
};

export async function signup(
  _: Response | null,
  formData: FormData,
): Promise<Response> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    full_name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: parsedData, error } = signupSchema.safeParse(data);

  if (error)
    return {
      error: error.flatten().fieldErrors,
      input: parsedData,
      success: false,
    };

  const { error: errorSignUp } = await supabase.auth.signUp({
    email: parsedData.email,
    password: parsedData.password,
    options: {
      data: {
        full_name: parsedData.full_name,
      },
    },
  });

  if (errorSignUp) {
    return {
      success: false,
      message: errorSignUp.message,
      input: parsedData,
    };
  }

  return {
    success: true,
    message: "Registration succeed. Please check your email to verify account.",
  };
}
