"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export default function MusicSwiperSkeleton() {
  return (
    <div className="container flex flex-col items-center max-w-md px-4 py-8 mx-auto gap-8 min-h-screen">
      {/* Seed song skeleton */}
      <div className="relative w-full bg-foreground rounded-xl">
        <div className="flex items-center p-4 space-x-4">
          <Skeleton className="relative flex-shrink-0 w-16 h-16 rounded-md" />
          <div className="flex-1">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-40 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Controls skeleton */}
      <div className="flex flex-col items-center justify-items-center space-y-4">
        <Skeleton className="h-4 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-4 w-56" />
        
        {/* Undo button skeleton */}
        <Skeleton className="h-10 w-24 rounded-full" />
        
        {/* Swipe controls skeleton */}
        <div className="flex space-x-8">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>
      
      {/* Progress indicator skeleton */}
      <div className="w-full flex flex-col items-center space-y-2">
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between w-full">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>

      {/* Card stack skeleton */}
      <AnimatePresence>
        <div className="relative w-full h-[400px]">
          {/* Show 3 skeleton cards for stack effect */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 1, scale: 1 - index * 0.05, y: index * 10 }}
              style={{ zIndex: 3 - index }}
            >
              <Skeleton className="w-full h-[400px] rounded-xl" />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  )
}