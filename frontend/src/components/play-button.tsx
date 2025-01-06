"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause } from 'lucide-react'
import { useAudio } from '@/lib/audio-context'
import { Song } from "@/db/schema"
import { cn } from "@/lib/utils"

interface PlayButtonProps {
  song: Song
  className?: string
}

export function PlayButton({ song, className }: PlayButtonProps) {
  const { currentTrack, isPlaying, playTrack} = useAudio()
  const isCurrentTrack = currentTrack?.id === song.id
  return (
    <Button 
    className={cn("", className)}
      size="icon" 
      variant="ghost"
      onClick={() => playTrack(song)}
    >
      {isCurrentTrack && isPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isCurrentTrack && isPlaying ? `Pause ${song.name}` : `Play ${song.name}`}
      </span>
    </Button>
  )
}