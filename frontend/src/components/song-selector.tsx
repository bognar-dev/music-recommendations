"use client"

import { useState } from "react"
import Link from 'next/link'
import { Song } from '@/db/schema'
import { SongCard } from "./song-card"
import { SongDetailsPanel } from "./song-details-panel"
import { SearchParams, stringifySearchParams } from '@/lib/url-state'

interface SongSelectorProps {
  song: Song
  searchParams: SearchParams
  priority: boolean
}

export function SongSelector({ song,priority }: SongSelectorProps) {
  const [isSelected, setIsSelected] = useState(false)

  return (
    <>
      <div
        className="block transition ease-in-out md:hover:scale-105"
        onClick={(e) => {
          e.preventDefault()
          setIsSelected(true)
        }}
      >
        <SongCard
          song={song}
          priority={priority}
        />
      </div>
      <SongDetailsPanel 
        song={isSelected ? song : null}
        isOpen={isSelected}
        onClose={() => setIsSelected(false)}
      />
    </>
  )
}

