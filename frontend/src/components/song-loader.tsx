"use client"

import { Song } from "@/db/schema"
import { useAudio } from "@/lib/audio-context"
interface SongLoaderProps {
    songs: Song[]
}

export function SongLoader({ songs }: SongLoaderProps) {
    const { addSongsToPlaylist } = useAudio()

    return (
        <p className="absolute hidden" onLoad={() => addSongsToPlaylist(songs)}></p>
    )
}   