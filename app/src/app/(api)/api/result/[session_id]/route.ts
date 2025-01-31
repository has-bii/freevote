import { createClient } from "@/utils/supabase/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ session_id: string }> },
) {
  const { session_id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("*,votes(*,choices(*),profiles(full_name,avatar))")
    .eq("id", session_id)
    .single();

  if (error)
    return Response.json({ data: null, error: error.message }, { status: 404 });

  return Response.json({ data, error: null }, { status: 200 });
}
