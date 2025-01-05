import { Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { SearchFilters } from '@/components/search-filters'
import { SongsGrid } from '@/components/songs-grid'
import { SongPagination } from '@/components/pagination'
import { getSongs } from '@/db/queries'

type Param = string | string[] | undefined
interface PageProps {
  searchParams: { [key: string]: Param }
}

export default async function SongsPage({ searchParams }: PageProps) {
  const { songs, total, totalPages } = await getSongs({
    query: searchParams.query?.toString(),
    page: Number(searchParams.page) || 1,
    minDanceability: searchParams.minDanceability ? Number(searchParams.minDanceability) : undefined,
    minEnergy: searchParams.minEnergy ? Number(searchParams.minEnergy) : undefined,
    sortBy: searchParams.sortBy?.toString(),
  })
  const currentPage = Number(searchParams.page) || 1

  return (
    <div className="flex h-full">
      <div className="w-64 p-4 border-r hidden md:block">
        <SearchFilters />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="border-b p-4">
          <Input
            type="search"
            placeholder="Search songs..."
            className="max-w-xl"
            defaultValue={searchParams.query?.toString()}
          />
        </header>

        <div className="flex-grow overflow-auto min-h-[200px]">
          <div className="group-has-[[data-pending]]:animate-pulse p-4">
            <Suspense fallback={<div>Loading songs...</div>}>
              <SongsGrid songs={songs} />
            </Suspense>
          </div>
        </div>

        <div className="mt-auto p-4 border-t">
          <Suspense fallback={null}>
            <SongPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={total}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}