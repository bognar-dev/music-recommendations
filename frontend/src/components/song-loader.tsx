"use client"

import { useAudio } from "@/context/audio-context"
import { Song } from "@/db/schema"
interface SongLoaderProps {
    songs: Song[]
}

export function SongLoader({ songs }: SongLoaderProps) {
    const { addSongsToPlaylist } = useAudio()

    return (
        <p className="absolute hidden" onLoad={() => addSongsToPlaylist(songs)}></p>
    )
}   