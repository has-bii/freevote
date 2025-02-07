"use client"

import React, { useEffect, useRef } from "react"
import { Skeleton } from "./ui/skeleton"

type Props = {
  isLoadingIntial: boolean
  isLoadingMore: boolean
  children: React.ReactNode
  loadMore: () => void
}

function InfiniteScroll(props: Props) {
  const observerElement = useRef<HTMLDivElement | null>(null)
  const { isLoadingIntial, isLoadingMore, children, loadMore } = props

  useEffect(() => {
    // is element in view?
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry) => {
        if (entry.isIntersecting && (!isLoadingMore || !isLoadingIntial)) {
          loadMore()
        }
      })
    }

    // create observer instance
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    })

    if (observerElement.current) {
      observer.observe(observerElement.current)
    }

    // cleanup function
    return () => observer.disconnect()
  }, [isLoadingMore, isLoadingIntial, loadMore])

  return (
    <>
      <>{children}</>

      <div ref={observerElement}>
        {isLoadingMore && !isLoadingIntial && (
          <Skeleton className="mt-4 h-32 w-full rounded-lg" />
        )}
      </div>
    </>
  )
}

export default InfiniteScroll
