import { Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { SearchFilters } from '@/components/search-filters'
import { SongsGrid } from '@/components/songs-grid'
import { SongPagination } from '@/components/pagination'
import { getSongs } from '@/lib/data'

type Param = string | string[] | undefined
interface SongsPageProps {
  searchParams: { [key: string]: Param }
}

const parse = (param: Param) => {
  return typeof param === 'string' ? param : undefined
}
const SongsPage = ({
  searchParams,
}: SongsPageProps) => {
  const { songs, total, totalPages } = getSongs(searchParams)
  const currentPage = Number(searchParams.page) || 1
  console.log(songs)
  console.log(searchParams)
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
            defaultValue={searchParams.query}
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



export default SongsPage