"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"
import { z } from "zod"

const FormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min. 8 characters!"),
})

export type LoginActionInitState = {
  error?: string
  input?: {
    email?: string
  }
}

export async function login(
  _: LoginActionInitState | null,
  formData: FormData,
): Promise<LoginActionInitState> {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { data: parsedData, error } = FormSchema.safeParse(data)

  if (error)
    return {
      error: "Invalid input!",
    }

  const { error: loginError } =
    await supabase.auth.signInWithPassword(parsedData)

  if (loginError) {
    return {
      error: loginError.message,
      input: {
        email: parsedData.email,
      },
    }
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function loginWithGoogle() {
  const supabase = await createClient()

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (data.url) {
    console.log("URL: ", data.url)
    redirect(data.url) // use the redirect API for your server framework
  }
}
