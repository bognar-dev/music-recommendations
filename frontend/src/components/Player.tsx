"use client"
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useAudio } from '@/lib/audio-context'
import Image from 'next/image'

export default function Player() {
  const { currentTrack,
     isPlaying,
      togglePlay,
      isRepeatEnabled,
    toggleRepeat,
    nextTrack,
    previousTrack, 
    volume,
     setVolume,
      progress,
       duration,
        seek
       } = useAudio();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
         {currentTrack.image_url !== 'no' && (
                  <Image
                    src={currentTrack.image_url!}
                    alt={`${currentTrack.name} by ${currentTrack.artist}`}
                    className="object-cover transition-transform group-hover:scale-105"
                    width={48}
                    height={48}
                  />)}
          <div>
            <h3 className="text-sm font-medium">{currentTrack.name}</h3>
            <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-xl">
        <div className="flex items-center space-x-4">
      <Button variant="ghost" size="icon" onClick={previousTrack}>
        <SkipBack className="h-4 w-4" />
      </Button>
      <Button 
        onClick={togglePlay} 
        size="icon"
        className="h-8 w-8 rounded-full"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <Button variant="ghost" size="icon" onClick={nextTrack}>
        <SkipForward className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleRepeat}
        className={isRepeatEnabled ? "text-primary" : ""}
      >
        <Repeat className="h-4 w-4" />
      </Button>
    </div>
          <div className="flex items-center space-x-2 w-full">
    <span className="text-xs text-muted-foreground">
      {formatTime((progress / 100) * duration)}
    </span>
    <Slider
      value={[progress]}
      max={100}
      step={1}
      className="w-full"
      onValueChange={([value]) => seek(value)}
    />
    <span className="text-xs text-muted-foreground">
      {formatTime(duration)}
    </span>
  </div>
        </div>
        <div className="flex items-center space-x-2 min-w-[120px]">
    <Volume2 className="h-4 w-4" />
    <Slider
      value={[volume]}
      max={100}
      step={1}
      className="w-[80px]"
      onValueChange={([value]) => setVolume(value)}
    />
  </div>
      </div>
    </div>
  )
}
