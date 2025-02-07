import { useGetPublic } from "@/hooks/public/use-get-public"
import { useSupabase } from "@/utils/supabase/client"
import React from "react"
import { Skeleton } from "../ui/skeleton"
import InfiniteScroll from "../infinite-scroll"
import PublicVotingOverview from "./public-voting-overview"

type Props = {
  searchValue: string
}

export default function PublicVoting({ searchValue }: Props) {
  const supabase = useSupabase()
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
  } = useGetPublic({
    supabase,
    name: searchValue,
  })

  const pages = data?.pages.flat()

  const render = React.useMemo(() => {
    if (pages === undefined || pages.length === 0)
      return (
        <div className="flex h-28 w-full items-center justify-center rounded-lg border border-border bg-muted">
          <p className="text-center text-sm text-muted-foreground">
            Public voting not found. Please search with another keyword.
          </p>
        </div>
      )

    return pages.map((v, i) => <PublicVotingOverview key={i} data={v} />)
  }, [pages])

  if (isLoading)
    return (
      <div className="flex w-full flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    )

  if (error)
    return (
      <div className="flex min-h-28 w-full items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-4">
        <p className="h-fit text-center text-sm text-destructive">
          {error.message}
        </p>
      </div>
    )

  return (
    <InfiniteScroll
      isLoadingIntial={isLoading}
      isLoadingMore={isFetchingNextPage}
      loadMore={() => hasNextPage && fetchNextPage()}
    >
      <div className="flex w-full flex-col gap-4">{render}</div>
    </InfiniteScroll>
  )
}
