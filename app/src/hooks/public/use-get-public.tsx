import { getRange } from "@/utils/paginate"
import { TSupabaseClient } from "@/utils/supabase/server"
import { useInfiniteQuery } from "@tanstack/react-query"

type UseGetPublicProps = {
  supabase: TSupabaseClient
  name: string
}

export const useGetPublic = ({ name, supabase }: UseGetPublicProps) =>
  useInfiniteQuery({
    queryKey: ["public", name],
    queryFn: async ({ pageParam }) => {
      try {
        const range = getRange(pageParam, 10)

        const mappedName = name
          .trim()
          .split(" ")
          .filter((v) => v.length !== 0)
          .map((v) => `'${v}'`)

        const query = supabase
          .from("votings")
          .select("*,profiles(full_name,avatar)")

        if (mappedName.length > 0)
          query.textSearch("name", `${mappedName.join(" | ")}`)

        query
          .order("created_at", { ascending: false })
          .range(range[0], range[1])

        const { data, error } = await query

        if (error) throw error

        return data
      } catch (error) {
        throw error
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage: number | undefined = lastPage.length
        ? allPages.length
        : undefined

      return nextPage
    },
  })
