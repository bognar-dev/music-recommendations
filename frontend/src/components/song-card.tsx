import Image from "next/image"
import { Play } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Song } from "@/types/music"

interface SongCardProps {
  song: Song
  onClick?: () => void
}

export function SongCard({ song, onClick }: SongCardProps) {
  

  return (
    <Card className="overflow-hidden group cursor-pointer" onClick={onClick}>
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={song.img}
            alt={`${song.name} by ${song.artist}`}
            className="object-cover transition-transform group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {song.preview && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Play className="h-4 w-4" />
              <span className="sr-only">Play preview</span>
            </Button>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate">{song.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        </div>
      </CardContent>
    </Card>
  )
}

