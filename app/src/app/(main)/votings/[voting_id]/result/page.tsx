import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ voting_id: string }>;
};

export default async function Page({ params }: Props) {
  const { voting_id } = await params;

  redirect(`/votings/${voting_id}/vote`);
}
