"use client"
import { useState } from "react"
import { SongCard } from "./song-card"
import { SongDetailsPanel } from "./song-details-panel"
import type { Song } from "@/db/schema"

interface SongsGridProps {
  songs: Song[]
}

export function SongsGrid({ songs }: SongsGridProps) {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {songs.map((song) => (
          <SongCard 
            key={song.spotify_id} 
            song={song} 
            onClick={() => {
              setSelectedSong(song)
              setIsPanelOpen(true)
            }}
          />
        ))}
      </div>
      <SongDetailsPanel 
        song={selectedSong}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </>
  )
}

