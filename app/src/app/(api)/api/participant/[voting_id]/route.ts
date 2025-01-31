import { actionGetParticipants } from "@/hooks/participants/action-get-participants";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ voting_id: string }> },
) {
  const { voting_id } = await params;

  const { data, error } = await actionGetParticipants(voting_id);

  if (error)
    return Response.json({ data: null, error: error }, { status: 404 });

  return Response.json({ data, error: null }, { status: 200 });
}
