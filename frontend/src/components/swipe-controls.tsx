"use client"

import { motion } from "framer-motion"
import { X, Heart } from "lucide-react"

interface SwipeControlsProps {
  handleSwipe: (direction: "left" | "right") => void
}

export default function SwipeControls({ handleSwipe }: SwipeControlsProps) {
  return (
    <div className="flex items-center justify-center w-full space-x-4">
      <motion.button
        className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-full shadow-lg"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        type="button"
        onClick={() => handleSwipe("left")}
      >
        <X className="w-8 h-8 text-white" />
      </motion.button>

      <motion.button
        className="flex items-center justify-center w-16 h-16 bg-spotify-green rounded-full shadow-lg"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        type="button"
        onClick={() => handleSwipe("right")}
      >
        <Heart className="w-8 h-8 text-white" />
      </motion.button>
    </div>
  )
}

