import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { Song } from "@/db/schema"
import { PlayButton } from "./play-button"

interface SongCardProps {
  song: Song
  priority: boolean
}

export function SongCard({ song, priority }: SongCardProps) {
  console.log(song.image_url)

  return (
    <Card className="overflow-hidden group cursor-pointer duration-300">
      <CardContent className="p-0">
        <div className="relative aspect-square">
        {song.image_url !== 'no' && (
          <Image
            src={song.image_url!}
            alt={`${song.name} by ${song.artist}`}
            className="object-cover transition-transform group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />)}
            {song.preview_url ? (
            <PlayButton
            className="absolute inset-0"
            song={song}/>
            ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:scale-105">
              <p className="text-white text-sm">No preview available</p>
            </div>
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

