"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <img
            src="/placeholder.svg?height=48&width=48"
            alt="Album cover"
            className="h-12 w-12 rounded"
          />
          <div>
            <h3 className="text-sm font-medium">Song Title</h3>
            <p className="text-xs text-muted-foreground">Artist Name</p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-xl">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setIsPlaying(!isPlaying)} 
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-muted-foreground">0:00</span>
            <Slider
              value={[progress]}
              max={100}
              step={1}
              className="w-full"
              onValueChange={([value]) => setProgress(value)}
            />
            <span className="text-xs text-muted-foreground">3:45</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 min-w-[120px]">
          <Volume2 className="h-4 w-4" />
          <Slider
            defaultValue={[100]}
            max={100}
            step={1}
            className="w-[80px]"
          />
        </div>
      </div>
    </div>
  )
}

