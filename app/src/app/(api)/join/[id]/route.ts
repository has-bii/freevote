"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const url = req.nextUrl.clone();
  const id = (await params).id;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    url.pathname = "/login";
    redirect(url.toString());
  }

  const { data: isExist } = await supabase
    .from("votings")
    .select("*")
    .eq("id", id)
    .single();

  if (!isExist) {
    url.pathname = `/votings/${id}`;
    redirect(url.toString());
  }

  const { error } = await supabase.from("voters").insert({ voting_id: id });

  if (error) {
    url.pathname = `/votings/${id}`;
    redirect(url.toString());
  }

  url.pathname = `/votings/${id}`;

  redirect(url.toString());
}
