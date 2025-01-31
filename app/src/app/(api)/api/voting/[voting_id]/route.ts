import { createClient } from "@/utils/supabase/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ voting_id: string }> },
) {
  const { voting_id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("votings")
    .select("*")
    .eq("id", voting_id)
    .single();

  if (error)
    return Response.json({ data: null, error: error.message }, { status: 404 });

  return Response.json({ data, error: null }, { status: 200 });
}
