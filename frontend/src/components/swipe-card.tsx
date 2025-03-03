"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useMotionValue, useTransform, type PanInfo, useAnimation } from "framer-motion"

import type { Song } from "@/db/schema"
import { useAudio } from "@/context/audio-context"
import { PlayButton } from "./play-button"
import { Music } from "lucide-react"

interface SongCardProps {
  song: Song
  index: number
  handleSwipe: (direction: "left" | "right") => void
  isActive: boolean
}

export default function SongCard({ song, index, handleSwipe, isActive }: SongCardProps) {
  const [exitX, setExitX] = useState(0)
  const [exitY, setExitY] = useState(0)
  const [exitRotation, setExitRotation] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  
  // Use audio context instead of managing audio locally
  const { currentTrack, isPlaying } = useAudio()

  // Motion values for the drag
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useMotionValue(0)

  // Transform the x motion value to control opacity of like/dislike indicators
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const dislikeOpacity = useTransform(x, [-100, 0], [1, 0])

  // Controls for animations
  const controls = useAnimation()

  // Check if this song is currently playing
  const isThisSongPlaying = currentTrack?.id === song.id && isPlaying

  // Handle drag end
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 300
    const velocity = 0.5

    // Calculate if the card should be dismissed based on drag distance or velocity
    const shouldDismiss = Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocity

    if (shouldDismiss) {
      // Set exit values for the card to fly off in the right direction
      const direction = info.offset.x > 0 ? "right" : "left"
      const multiplier = 1.5

      setExitX(info.velocity.x * 100 * multiplier)
      setExitY(info.velocity.y * 100)
      setExitRotation(info.velocity.x * 10)

      // Trigger the parent component's swipe handler
      handleSwipe(direction)
    } else {
      // If not dismissed, animate back to center
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        transition: { type: "spring", stiffness: 500, damping: 30 },
      })
    }
  }

  // Update rotation based on drag position
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Calculate rotation based on horizontal drag
    // The further from center, the more rotation
    const rotationFactor = 0.05
    rotate.set(info.offset.x * rotationFactor)
  }


 

  
  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopVisualization();
      
      // Clean up audio context on unmount
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
      }
    };
  }, []);

  // Calculate z-index and scale based on position in stack
  const zIndex = 1 - index
  const scale = 1 - index * 0.05 // Each card is slightly smaller
  const y_offset = index * 10 // Each card is slightly lower

  return (
    <motion.div
      className="absolute w-full overflow-hidden bg-background rounded-xl shadow-xl"
      style={{
        zIndex,
        x,
        y: y_offset,
        rotate,
        scale,
      }}
      drag={isActive}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale, y: y_offset }}
      exit={{
        x: exitX,
        y: exitY,
        rotate: exitRotation,
        opacity: 0,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: scale * 1.05 }}
      transition={{ type: "spring" }}
    >
      {/* Background gradient based on song colors */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(to bottom right, ${song.most_vibrant_color || "#1DB954"}, ${song.weighted_average_color || "#191414"})`,
        }}
      />

      {/* Like indicator */}
      <motion.div
        className="absolute top-4 right-4 px-3 py-1 font-bold text-white bg-green-500 rounded-full"
        style={{ opacity: likeOpacity }}
      >
        LIKE
      </motion.div>

      {/* Dislike indicator */}
      <motion.div
        className="absolute top-4 left-4 px-3 py-1 font-bold text-white bg-red-500 rounded-full"
        style={{ opacity: dislikeOpacity }}
      >
        NOPE
      </motion.div>

      {/* Album art */}
      <div className="relative w-full aspect-square select-none">
        <Image
          src={song.image_url && song.image_url !== "no" ? song.image_url : '/placeholder.svg'}
          alt={song.name}
          width={400}
          height={400}
          className="object-cover w-full h-full"
          priority={index === 0}
        />
        <PlayButton song={song}/>
      </div>

      {/* Song info */}
      <div className="p-4">
        <h2 className="text-xl font-bold truncate">{song.name}</h2>
        <p className="text-gray-400 truncate">{song.artist}</p>

        {/* Audio features visualization */}
        <div className="flex items-center mt-4 space-x-2">
          <Music className="w-4 h-4 text-spotify-green" />
          <div className="text-xs text-gray-400">
            Energy: {song.energy.toFixed(2)} • Danceability: {song.danceability.toFixed(2)}
          </div>
        </div>

        {/* Audio visualizer */}
        {isThisSongPlaying && (
          <div className="mt-2 h-12">
            <canvas ref={canvasRef} width={300} height={48} className="w-full h-full" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

