"use client"

import { useEffect, useState, useRef, ChangeEvent } from "react"
import { surveySchema } from "@/lib/survey-schema"
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
import { z } from "zod"


interface MusicSwiperProps {
  seedSong: Song
  recommendations: Song[]
  step: keyof z.infer<typeof surveySchema>
}

export default function MusicSwiper({ seedSong, recommendations, step,  }: MusicSwiperProps) {

  const [swipeHistory, setSwipeHistory] = useState<Array<{ song: Song; liked: boolean }>>([])
  const isMobile = useMediaQuery("(max-width: 640px)")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { updateSurveyDetails, surveyData } = useSurveyContext()

  const t = useTranslations('StepForm');

  const surveyStep = surveyData[step as keyof typeof surveyData]
  if (surveyStep.step == 10) {
    throw new Error("Survey is already completed")
  }
  const likedSongs = surveyStep.songRatings.filter(rating => rating.rating)
  const dislikedSongs = surveyStep.songRatings.filter(rating => !rating.rating)
  const currentIndex = surveyStep.songRatings.length
  const isFinished = currentIndex >= recommendations.length

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    // Handle song ratings (boolean: liked/disliked)
    if (name.startsWith('songRatings.')) {
        const [_, songId, field] = name.split('.');
        const existingSongRating = surveyStep.songRatings.find(
            sr => sr.songId === Number(songId)
        );
        
        // Use checked property for boolean value
        const updatedRating = {
            songId: Number(songId),
            songName: recommendations.find(r => r.id === Number(songId))?.name || '',
            modelId: surveyStep.modelId,
            rating: checked // Boolean value from checkbox
        };

        const updatedSongRatings = existingSongRating
            ? surveyStep.songRatings.map(sr =>
                sr.songId === Number(songId) ? updatedRating : sr
            )
            : [...surveyStep.songRatings, updatedRating];

        updateSurveyDetails(step, {
            songRatings: updatedSongRatings
        });
    }

    // Handle model ratings
    if (name.startsWith('modelRating.')) {
        const [_, field] = name.split('.');
        updateSurveyDetails(step, {
            modelRating: {
                ...surveyStep.modelRating,
                [field]: Number(value)
            }
        });
    }
};

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex >= recommendations.length) return

    const currentSong = recommendations[currentIndex]
    const liked = direction === "right"
    updateSurveyDetails(step, {
      songRatings: [
        ...surveyStep.songRatings,
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


    updateSurveyDetails(step, {
      songRatings: [
        ...surveyStep.songRatings,
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


    updateSurveyDetails(step, {
      songRatings: surveyStep.songRatings.filter(rating => rating.songId !== lastAction.song.id)
    });

    // Remove from appropriate list
    if (lastAction.liked) {

      console.log("undo liked")
    } else {
      console.log("undo disliked")
    }

  }






  return (
    <div className="container flex flex-col items-center max-w-md px-4 py-8 mx-auto gap-8 min-h-screen ">

      {/* Seed song */}
      <h3 className="text-lg font-bold">Recommendations based on</h3>
      <SeedSong song={seedSong} />

      {/* Controls */}
      <div className="flex flex-col items-center justify-items-center space-y-4">
        {!isFinished && (

          <>
            <p className="text-sm  flex flex-col gap-2 justify-items-center justify-center items-center">Would you add this song to your playlist?</p>
            <p>Swipe right to save, left to skip.</p>
            <p className="text-xs flex flex-col gap-2 justify-items-center justify-center items-center">You can undo your last swipe here <ArrowBigDownIcon /></p>
          </>
        )}

        <UndoButton handleUndo={handleUndo} />
        {!isFinished && (
        <SwipeControls handleSwipe={handleSwipe} />
      )}
      </div>
    
      {/* Progress indicator */}
      <SwipeProgress current={currentIndex} total={recommendations.length} liked={likedSongs.length} />
      {/* Card stack */}

      <h3 className="text-lg font-bold">Recommendations to rate</h3>

      <AnimatePresence>

        {!isFinished ? (
          <div className="relative  h-[100px] w-3/4 md:w-full md:h-[400px] ">
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
                  <VinylRating name="modelRating.relevance" value={surveyStep.modelRating.relevance} onChange={handleInputChange} />
                </ul>
              </div>

              {/* Novelty */}
              <div>
                <Label htmlFor="novelty">{t('novelty')}</Label>
                <ul className="flex space-x-2 mt-2">
                  <VinylRating name="modelRating.novelty" value={surveyStep.modelRating.novelty} onChange={handleInputChange} />
                </ul>
              </div>

              {/* Satisfaction */}
              <div>
                <Label htmlFor="satisfaction">{t('satisfaction')}</Label>
                <ul className="flex space-x-2 mt-2">
                  <VinylRating name="modelRating.satisfaction" value={surveyStep.modelRating.satisfaction} onChange={handleInputChange} />
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

