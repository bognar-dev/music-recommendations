import { SongsPagination } from '@/components/pagination'
import { Search, SearchFallback } from '@/components/search'
import { SearchFilters } from '@/components/search-filters'
import { SongsGrid } from '@/components/songs-grid'
import { estimateTotalSongs, fetchSongsWithPagination, ITEMS_PER_PAGE } from '@/db/queries'
import { parseSearchParams } from '@/lib/url-state'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'


export default async function Page(
  props: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  }
) {


  const cookieStore = await cookies()
  const acceptedTerms = cookieStore.get('accepted-terms')
  if (!acceptedTerms) {
    redirect('/')
  }
  const searchParams = await props.searchParams;
  const parsedSearchParams = parseSearchParams(searchParams);

  const [songs, estimatedTotal] = await Promise.all([
    fetchSongsWithPagination(parsedSearchParams),
    estimateTotalSongs(parsedSearchParams),
  ]);



  const totalPages = Math.ceil(estimatedTotal / ITEMS_PER_PAGE);
  const currentPage = Math.max(1, Number(parsedSearchParams.page) || 1);

  return (
    <div className="flex h-full border-t border-foreground/20 dark:border-background">
      <div className="w-64 p-4 border-r hidden md:block border-foreground/20 dark:border-background">
        <SearchFilters />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="p-4">
            <Search />
        </header>

        <div className="flex-grow overflow-auto min-h-[200px]">
          <div className="group-has-[[data-pending]]:animate-pulse p-4">
            <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
              <SongsGrid songs={songs} searchParams={searchParams} />
            </Suspense>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-foreground/20 dark:border-background mb-20">
          
            <SongsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={estimatedTotal}
              searchParams={searchParams}
            />
        </div>
      </div>
    </div>
  )
}