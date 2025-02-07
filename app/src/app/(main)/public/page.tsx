"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useDebounce } from "@uidotdev/usehooks"
import PublicVoting from "@/components/public/public-voting"

export default function Page() {
  const [name, setName] = React.useState("")
  const [search, setSearch] = React.useState("")
  const debounce = useDebounce(name, 500)

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value)
    },
    [],
  )

  const onSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setName(formData.get("search")?.toString() ?? "")
    e.currentTarget.reset()
    e.currentTarget.focus()
  }, [])

  React.useEffect(() => {
    const search = () => {
      setSearch(debounce)
    }

    search()
  }, [debounce])

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Public Votings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Content page */}
      <div className="flex-1 space-y-4 p-4 pt-0">
        <h1 className="text-xl font-bold lg:text-2xl">
          Explore Public Votings
        </h1>

        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <Input
            name="search"
            className="w-full flex-1 lg:max-w-sm"
            placeholder="Search by name"
            onChange={handleChange}
          />
          <Button type="submit">
            <Search />
            Search
          </Button>
        </form>

        <div className="w-full pt-2">
          <PublicVoting searchValue={search} />
        </div>
      </div>
    </>
  )
}
