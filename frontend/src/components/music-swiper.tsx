"use client"

import { useEffect, useState, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import SongCard from "@/components/swipe-card"
import SwipeControls from "@/components/swipe-controls"
import SwipeProgress from "@/components/swipe-progress"
import UndoButton from "@/components/undo-button"
import type { Song } from "@/db/schema"
import { Loader2 } from "lucide-react"
import SeedSong from "./seeded-song"


interface SeedSongProps {
    seedSong: Song
    recommendations: Song[]
}

export default function MusicSwiper( { seedSong, recommendations }: SeedSongProps ) {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedSongs, setLikedSongs] = useState<Song[]>([])
  const [dislikedSongs, setDislikedSongs] = useState<Song[]>([])
  const [swipeHistory, setSwipeHistory] = useState<Array<{ song: Song; liked: boolean }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load songs and preferences from localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // In a real app, you would fetch songs from an API
        // For now, use sample data
        setSongs(recommendations)

        // Load preferences from localStorage
        const storedLiked = localStorage.getItem("likedSongs")
        const storedDisliked = localStorage.getItem("dislikedSongs")
        const storedHistory = localStorage.getItem("swipeHistory")

        if (storedLiked) setLikedSongs(JSON.parse(storedLiked))
        if (storedDisliked) setDislikedSongs(JSON.parse(storedDisliked))
        if (storedHistory) {
          setSwipeHistory(JSON.parse(storedHistory))
          // Adjust current index based on history
          setCurrentIndex(JSON.parse(storedHistory).length)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Failed to load data:", err)
        setError("Failed to load recommendations. Please try again.")
        setIsLoading(false)
      }
    }

    loadData()

    // Initialize audio element
    audioRef.current = new Audio()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (likedSongs.length > 0) {
      localStorage.setItem("likedSongs", JSON.stringify(likedSongs))
    }
    if (dislikedSongs.length > 0) {
      localStorage.setItem("dislikedSongs", JSON.stringify(dislikedSongs))
    }
    if (swipeHistory.length > 0) {
      localStorage.setItem("swipeHistory", JSON.stringify(swipeHistory))
    }
  }, [likedSongs, dislikedSongs, swipeHistory])

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex >= songs.length) return

    const currentSong = songs[currentIndex]
    const liked = direction === "right"

    // Add to appropriate list
    if (liked) {
      setLikedSongs((prev) => [...prev, currentSong])
      // Provide haptic feedback on mobile devices
      if (navigator.vibrate && isMobile) {
        navigator.vibrate(50)
      }
    } else {
      setDislikedSongs((prev) => [...prev, currentSong])
    }

    // Add to history
    setSwipeHistory((prev) => [...prev, { song: currentSong, liked }])

    // Move to next song
    setCurrentIndex((prev) => prev + 1)

    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const handleUndo = () => {
    if (swipeHistory.length === 0) return

    // Remove last action from history
    const lastAction = swipeHistory[swipeHistory.length - 1]
    setSwipeHistory((prev) => prev.slice(0, -1))

    // Remove from appropriate list
    if (lastAction.liked) {
      setLikedSongs((prev) => prev.filter((song) => song.id !== lastAction.song.id))
    } else {
      setDislikedSongs((prev) => prev.filter((song) => song.id !== lastAction.song.id))
    }

    // Go back to previous song
    setCurrentIndex((prev) => prev - 1)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <Loader2 className="w-12 h-12 text-spotify-green animate-spin" />
        <p className="text-lg font-medium text-spotify-green">Loading recommendations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <div className="p-4 text-red-500 bg-red-100 rounded-lg dark:bg-red-900/20">
          <p>{error}</p>
          <button
            className="px-4 py-2 mt-4 text-white bg-spotify-green rounded-full hover:bg-spotify-green/90"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const isFinished = currentIndex >= songs.length

  return (
    <div className="container flex flex-col items-center max-w-md px-4 py-8 mx-auto space-y-8">

      {/* Seed song */}
      <SeedSong song={seedSong}/>

      {/* Progress indicator */}
      <SwipeProgress current={currentIndex} total={songs.length} liked={likedSongs.length} />

      {/* Card stack */}
      <div className="relative w-full h-[400px]">
        <AnimatePresence>
          {!isFinished ? (
            <>
              {/* Show next 3 cards for stack effect */}
              {songs.slice(currentIndex, currentIndex + 3).map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  index={index}
                  handleSwipe={handleSwipe}
                  isActive={index === 0}
                />
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full p-6 space-y-4 text-center bg-spotify-dark-gray rounded-xl">
              <h3 className="text-xl font-bold">All caught up!</h3>
              <p className="text-gray-400">You&apos;ve reviewed all {songs.length} recommendations.</p>
              <p className="text-spotify-green font-medium">You liked {likedSongs.length} songs.</p>
              <button
                className="px-6 py-3 mt-4 font-medium text-white bg-spotify-green rounded-full hover:bg-spotify-green/90"
                onClick={() => {
                  setCurrentIndex(0)
                  setSwipeHistory([])
                  setLikedSongs([])
                  setDislikedSongs([])
                  localStorage.removeItem("swipeHistory")
                  localStorage.removeItem("likedSongs")
                  localStorage.removeItem("dislikedSongs")
                }}
              >
                Start Over
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {!isFinished && (
        <div className="">
          <SwipeControls handleSwipe={handleSwipe} />
          {swipeHistory.length > 0 && <UndoButton handleUndo={handleUndo} />}
        </div>
      )}
    </div>
  )
}

