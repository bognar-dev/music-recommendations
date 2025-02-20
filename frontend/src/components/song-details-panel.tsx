"use client"

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'
import type { Song } from "@/db/schema"
import { parseListOfRgb, parseRgb } from '@/lib/numpy'

interface SongDetailsPanelProps {
  song: Song | null
  isOpen: boolean
  onClose: () => void
}


  const keyMap: { [key: string]: string } = {
    "-1": "No Key Detected",
    "0": "C",
    "1": "C♯/D♭",
    "2": "D",
    "3": "D♯/E♭",
    "4": "E",
    "5": "F",
    6: "F♯/G♭",
    7: "G",
    8: "G♯/A♭",
    9: "A",
    10: "A♯/B♭",
    11: "B",
  };


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


  const dominant_colors = parseListOfRgb(song.dominant_colors!)


  const renderProgressWithValue = (label: string, value: number) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">{label}</h3>
        <span className="text-sm text-muted-foreground">{value.toFixed(1)}</span>
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
          <h3 className="font-semibold mb-2">Dominant Colors</h3>
          <div className="flex space-x-2">
            {dominant_colors && dominant_colors.map((color, index) => (
              <div key={index} style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }} className="h-10 w-10 rounded-full" />
            ))}
          </div>
          <h3 className="font-semibold mb-2">Single Pixel Colour</h3>
          <div style={{ backgroundColor: `rgb(${parseRgb(song.single_pixel_color!)?.join(',')})` }} className="h-10 w-10 rounded-full" />
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Additional Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Key:</span> {song.key !== null ? keyMap[song.key] || 'Unknown' : 'Unknown'}</p>
              <p><span className="font-medium">Loudness:</span> {song.loudness.toFixed(1)} dB</p>
              
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

