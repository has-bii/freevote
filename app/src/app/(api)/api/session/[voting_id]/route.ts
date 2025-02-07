import { createClient } from "@/utils/supabase/server"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ voting_id: string }> },
) {
  const { voting_id } = await params

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("voting_id", voting_id)
    .order("created_at", { ascending: true })

  if (error)
    return Response.json({ data: null, error: error.message }, { status: 404 })

  return Response.json({ data, error: null }, { status: 200 })
}
