import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from 'lucide-react'

const playlistTracks = [
  { id: 1, title: "Shape of You", artist: "Ed Sheeran", albumCover: "/placeholder.svg?height=300&width=300" },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd", albumCover: "/placeholder.svg?height=300&width=300" },
  { id: 3, title: "Dance Monkey", artist: "Tones and I", albumCover: "/placeholder.svg?height=300&width=300" },
  { id: 4, title: "Someone You Loved", artist: "Lewis Capaldi", albumCover: "/placeholder.svg?height=300&width=300" },
  { id: 5, title: "Watermelon Sugar", artist: "Harry Styles", albumCover: "/placeholder.svg?height=300&width=300" },
]

export default function Playlist() {
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
                  <Button size="icon" variant="ghost">
                    <Play className="h-4 w-4" />
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

