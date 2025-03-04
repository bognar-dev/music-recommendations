"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Song } from "@/db/schema"
import { PlayButton } from "./play-button"
import { parseRgb } from "@/lib/numpy"

interface SeedSongProps {
    song: Song
}

export default function SeedSong({ song }: SeedSongProps) {

    return (
        <motion.div
            className="relative w-full  bg-spotify-dark-gray rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    background: song.most_vibrant_color && song.weighted_average_color
                        ? `linear-gradient(to bottom right, ${parseRgb(song.most_vibrant_color )}, ${parseRgb(song.weighted_average_color)})` 
                        : `linear-gradient(to bottom right, #1DB954, "#191414")`
                }}
            />

            <div className="flex items-center p-4 space-x-4">
                <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
                    <Image
                        src={song.image_url || "/placeholder.svg?height=64&width=64"}
                        alt={song.name}
                        width={64}
                        height={64}
                        className="object-cover"
                    />
                    <PlayButton song={song} />
                </div>

                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-400">Based on</h3>
                    <h2 className="text-lg font-bold truncate">{song.name}</h2>
                    <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
            </div>
        </motion.div>
    )
}

