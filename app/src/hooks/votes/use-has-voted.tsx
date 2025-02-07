import { TSupabaseClient } from "@/utils/supabase/server"
import { useQuery } from "@tanstack/react-query"

type Params = {
  supabase: TSupabaseClient
  session_id: string
  enabled: boolean
}

export const useHasVoted = ({ session_id, supabase, enabled }: Params) =>
  useQuery({
    queryKey: ["has voted", session_id],
    enabled,
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return null

      const { data } = await supabase
        .from("votes")
        .select("*")
        .eq("session_id", session_id)
        .eq("user_id", user.id)
        .single()

      return data
    },
  })
