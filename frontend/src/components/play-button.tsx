"use client"

import { Button } from "@/components/ui/button"
import { useAudio } from '@/context/audio-context'
import { Song } from "@/db/schema"
import { cn } from "@/lib/utils"
import { Pause, Play } from 'lucide-react'

interface PlayButtonProps {
  song: Song
  className?: string
}

export function PlayButton({ song, className }: PlayButtonProps) {
  const { currentTrack, isPlaying, playTrack } = useAudio()
  const isCurrentTrack = currentTrack?.id === song.id
  return (
    <button
      className={cn("absolute inset-0 flex items-center justify-center transition-opacity bg-black/40 hover:bg-black/60", className)}
      type="button"
    >
      {isCurrentTrack && isPlaying ? (
        <Pause className="w-8 h-8 text-white"
      onClick={() => playTrack(song)} />
      ) : (
        <Play className="w-8 h-8 text-white"
      onClick={() => playTrack(song)} />
      )}
      <span className="sr-only">
        {isCurrentTrack && isPlaying ? `Pause ${song.name}` : `Play ${song.name}`}
      </span>
    </button>
  )
}