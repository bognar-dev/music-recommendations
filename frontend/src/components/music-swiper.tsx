"use client"

import { useEffect, useState, useRef, ChangeEvent } from "react"
import { AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import SongCard from "@/components/swipe-card"
import SwipeControls from "@/components/swipe-controls"
import SwipeProgress from "@/components/swipe-progress"
import UndoButton from "@/components/undo-button"
import type { Song } from "@/db/schema"
import { ArrowBigDownIcon, Loader2 } from "lucide-react"
import SeedSong from "./seeded-song"
import { useSurveyContext } from "@/context/survey-context"
import { Label } from "./ui/label"
import { VinylRating } from "./vinyl-rating"
import { useTranslations } from "next-intl"
import SubmitButton from "./survey-submit"


interface MusicSwiperProps {
  seedSong: Song
  recommendations: Song[]
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function MusicSwiper({ seedSong, recommendations, handleInputChange}: MusicSwiperProps) {

  const [swipeHistory, setSwipeHistory] = useState<Array<{ song: Song; liked: boolean }>>([])
  const isMobile = useMediaQuery("(max-width: 640px)")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { updateSurveyDetails, surveyData } = useSurveyContext()

  const t = useTranslations('StepForm');
  const likedSongs = surveyData.stepOne.songRatings.filter(rating => rating.rating)
  const dislikedSongs = surveyData.stepOne.songRatings.filter(rating => !rating.rating)
  const currentIndex = surveyData.stepOne.songRatings.length
  const isFinished = currentIndex >= recommendations.length

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex >= recommendations.length) return

    const currentSong = recommendations[currentIndex]
    const liked = direction === "right"
    updateSurveyDetails('stepOne', {
      songRatings: [
        ...surveyData.stepOne.songRatings,
        {
          songId: currentSong.id,
          songName: currentSong.name,
          rating: liked
        }
      ]
    })
    // Add to appropriate list
    if (liked) {
      console.log("liked")
      // Provide haptic feedback on mobile devices
      if (navigator.vibrate && isMobile) {
        navigator.vibrate(50)
      }
    } else {
      console.log("disliked")
    }


    updateSurveyDetails('stepOne', {
      songRatings: [
        ...surveyData.stepOne.songRatings,
        {
          songId: currentSong.id,
          songName: currentSong.name,
          rating: liked
        }
      ]
    })

    // Add to history
    setSwipeHistory((prev) => [...prev, { song: currentSong, liked }])


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
    

    updateSurveyDetails('stepOne', {
      songRatings: surveyData.stepOne.songRatings.filter(rating => rating.songId !== lastAction.song.id)
    });

    // Remove from appropriate list
    if (lastAction.liked) {

      console.log("undo liked")
    } else {
      console.log("undo disliked")
    }

  }






  return (
    <div className="container flex flex-col items-center max-w-md px-4 py-8 mx-auto space-y-8 min-h-screen ">

      {/* Seed song */}
      <SeedSong song={seedSong} />

      {/* Controls */}
      {!isFinished && (
        <div className="flex flex-col items-center justify-items-center space-y-4">

          <p className="text-sm  flex flex-col gap-2 justify-items-center justify-center items-center">Would you add this song to your playlist?</p>
          <p>Swipe right to save, left to skip.</p>
          <p className="text-xs flex flex-col gap-2 justify-items-center justify-center items-center">You can undo your last swipe here <ArrowBigDownIcon /></p>
          <UndoButton handleUndo={handleUndo} />
          <SwipeControls handleSwipe={handleSwipe} />
        </div>
      )}
      {/* Progress indicator */}
      <SwipeProgress current={currentIndex} total={recommendations.length} liked={likedSongs.length} />
      {/* Card stack */}
      
        <AnimatePresence>
        
          {!isFinished ? (
            <div className="relative w-full h-[400px] ">
              {/* Show next 3 cards for stack effect */}
              {recommendations.slice(currentIndex, currentIndex + 3).map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  index={index}
                  handleSwipe={handleSwipe}
                  isActive={index === 0}
                />
              ))}
            
            </div>
          ) : (
            <div className="flex flex-col items-center justify-start w-full h-full p-6 space-y-4 text-center rounded-xl">
              <h3 className="text-xl font-bold">All caught up!</h3>
              <p className="text-gray-400">You&apos;ve reviewed all {recommendations.length} recommendations.</p>
              <p className="text-spotify-green font-medium">You liked {likedSongs.length} songs.</p>
              <p className="text-red-500 font-medium">You disliked {dislikedSongs.length} songs.</p>
              <div className="flex flex-col items-center justify-center justify-items-center space-y-4 ">
                            {/* Relevance */}
                            <div>
                                <Label htmlFor="relevance">{t('relevance')}</Label>
                                <ul className="flex space-x-2 mt-2">
                                    <VinylRating name="modelRating.relevance" value={surveyData.stepOne.modelRating.relevance} onChange={handleInputChange} />
                                </ul>
                            </div>

                            {/* Novelty */}
                            <div>
                                <Label htmlFor="novelty">{t('novelty')}</Label>
                                <ul className="flex space-x-2 mt-2">
                                    <VinylRating name="modelRating.novelty" value={surveyData.stepOne.modelRating.novelty} onChange={handleInputChange} />
                                </ul>
                            </div>

                            {/* Satisfaction */}
                            <div>
                                <Label htmlFor="satisfaction">{t('satisfaction')}</Label>
                                <ul className="flex space-x-2 mt-2">
                                    <VinylRating name="modelRating.satisfaction" value={surveyData.stepOne.modelRating.satisfaction} onChange={handleInputChange} />
                                </ul>
                            </div>
                        </div>
                        <SubmitButton text={t('submit')} />
            </div>
          )}
        </AnimatePresence>
      </div>
  )
}

