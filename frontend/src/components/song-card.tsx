import Image from "next/image"
import type { Song } from "@/db/schema"
import { PlayButton } from "./play-button"
import { Music } from "lucide-react"

interface SongCardProps {
  song: Song
  priority: boolean
  onClick?: () => void
}

export function SongCard({ song, priority, onClick }: SongCardProps) {

  return (
    <div className="bg-background rounded-xl shadow-xl">
      


      {/* Album art */}
      <div className="relative w-full aspect-square">
        <Image
          src={song.image_url && song.image_url !== "no" ? song.image_url : '/placeholder.svg'}
          alt={song.name}
          width={400}
          height={400}
          className="object-cover w-full h-full"
          priority={priority}
        />
        {song.preview_url ? (
          <PlayButton
            className="absolute inset-0"
            song={song} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:scale-105">
            <p className="text-white text-sm">No preview available</p>
          </div>
        )}
      </div>

      {/* Song info */}
      <div className="p-4 " onClick={onClick}>
        <div className="cursor-pointer">
        <h2 className="text-xl font-bold truncate hover:underline">{song.name}</h2>
        <p className="text-gray-400 truncate hover:underline">{song.artist}</p>
        </div>

        {/* Audio features visualization */}
        <div className="flex items-center mt-4 space-x-2">
          <Music className="w-4 h-4 text-spotify-green" />
          <div className="text-xs text-gray-400">
            Energy: {song.energy.toFixed(2)} • Danceability: {song.danceability.toFixed(2)}
          </div>
        </div>

      </div>
    </div>
  )
}

