"use server";

import { redirect } from "next/navigation";

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
    full_name?: string[];
    email?: string[];
    password?: string[];
  };
  input?: {
    full_name?: string;
    email?: string;
    password?: string;
  };
};

export async function signup(_: Response | null, formData: FormData) {
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
    const url = new URL("/register", process.env.NEXT_PUBLIC_APP_URL);
    url.searchParams.set("error", errorSignUp.message);
    redirect(url.toString());
  }

  const url = new URL("/register-success", process.env.NEXT_PUBLIC_APP_URL);
  url.searchParams.set("name", parsedData.full_name.split(" ")[0]);

  redirect(url.toString());
}
