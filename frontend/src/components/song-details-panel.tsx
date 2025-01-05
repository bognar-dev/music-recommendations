"use client"

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'
import type { Song } from "@/db/schema"

interface SongDetailsPanelProps {
  song: Song | null
  isOpen: boolean
  onClose: () => void
}

export function SongDetailsPanel({ song, isOpen, onClose }: SongDetailsPanelProps) {
  const [open, setOpen] = useState(isOpen)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) onClose()
  }

  if (!song) return null

  const renderProgressWithValue = (label: string, value: number) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">{label}</h3>
        <span className="text-sm text-muted-foreground">{value.toFixed(3)}</span>
      </div>
      <Progress value={value * 100} />
    </div>
  )

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{song.name}</SheetTitle>
          <SheetDescription>{song.artist}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
            {song.image_url !== 'no' && (
              <Image
            src={song.image_url!}
            alt={`${song.name} by ${song.artist}`}
            width={300}
            height={300}
            className="w-full h-auto rounded-md"
              />
            )}
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Track Features</h3>
            <div className="space-y-4">
              {renderProgressWithValue("Danceability", song.danceability)}
              {renderProgressWithValue("Energy", song.energy)}
              {renderProgressWithValue("Valence", song.valence)}
              {renderProgressWithValue("Acousticness", song.acousticness)}
              {renderProgressWithValue("Instrumentalness", song.instrumentalness)}
              {renderProgressWithValue("Liveness", song.liveness)}
              {renderProgressWithValue("Speechiness", song.speechiness)}
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Additional Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Spotify ID:</span> {song.spotify_id}</p>
              <p><span className="font-medium">Loudness:</span> {song.loudness.toFixed(2)} dB</p>
              <p><span className="font-medium">Preview:</span> {song.preview_url ? "Available" : "Not available"}</p>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Artist Averages</h3>
            <div className="space-y-4">
              {renderProgressWithValue("Artist Danceability", song.danceability_artist)}
              {renderProgressWithValue("Artist Energy", song.energy_artist)}
              {renderProgressWithValue("Artist Valence", song.valence_artist)}
              {renderProgressWithValue("Artist Acousticness", song.acousticness_artist)}
              {renderProgressWithValue("Artist Instrumentalness", song.instrumentalness_artist)}
              {renderProgressWithValue("Artist Liveness", song.liveness_artist)}
              {renderProgressWithValue("Artist Speechiness", song.speechiness_artist)}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

