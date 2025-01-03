import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play,Pause } from 'lucide-react'
import {useAudio} from '@/lib/audio-context'
import playlistTracks from '@/data/playlist'

export default function Playlist() {
  const { currentTrack, isPlaying, playTrack } = useAudio()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Curated Playlist</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {playlistTracks.map((track) => (
            <li key={track.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
              <img
                src={track.albumCover}
                alt={`${track.title} album cover`}
                className="h-16 w-16 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{track.title}</p>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => playTrack(track)}
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    <span className="sr-only">Play {track.title}</span>
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
