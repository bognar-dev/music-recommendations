"use client"

import { motion } from "framer-motion"
import { RotateCcw } from "lucide-react"

interface UndoButtonProps {
  handleUndo: () => void
}

export default function UndoButton({ handleUndo }: UndoButtonProps) {
  return (
    <motion.button
      className="flex items-center justify-center px-4 py-2 space-x-2 text-sm font-medium text-white bg-gray-700 rounded-full hover:bg-gray-600"
      whileTap={{ scale: 0.95 }}
      onClick={handleUndo}
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <RotateCcw className="w-4 h-4" />
      <span>Undo Last Swipe</span>
    </motion.button>
  )
}

