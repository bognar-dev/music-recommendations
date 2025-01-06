import { Song } from '@/db/schema'
import { SearchParams } from '@/lib/url-state'
import { SongSelector } from "./song-selector"
import { SongLoader } from './song-loader'

interface SongsGridProps {
  songs: Song[]
  searchParams: SearchParams
}

export function SongsGrid({ songs, searchParams }: SongsGridProps) {

  if (!songs?.length) {
    return (
      <p className="text-center text-muted-foreground col-span-full">
        No songs found.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <SongLoader songs={songs} />
      {songs.map((song, index) => (
        <SongSelector
          key={song.id}
          song={song}
          searchParams={searchParams}
          priority={index < 10}
        />
      ))}
    </div>
  )
}

