"use client"

import { motion } from "framer-motion"

interface SwipeProgressProps {
  current: number
  total: number
  liked: number
}

export default function SwipeProgress({ current, total, liked }: SwipeProgressProps) {
  const progress = (current / total) * 100

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {current} of {total} songs
        </span>
        <span>{liked} liked</span>
      </div>
      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-spotify-green"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

