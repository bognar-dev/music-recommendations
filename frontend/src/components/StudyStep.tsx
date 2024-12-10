"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Playlist from './Playlist'
import Recommendations from './Recommendations'

interface ModelRatings {
  relevance: string
  novelty: string
  satisfaction: string
}

interface StudyStepProps {
  step: number
  totalSteps: number
  onNextStep: () => void
}

export default function StudyStep({ step, totalSteps, onNextStep }: StudyStepProps) {
  const searchParams = useSearchParams()
  const [songRatings, setSongRatings] = useState<{ [key: number]: number }>({})
  const [modelRatings, setModelRatings] = useState<ModelRatings>({
    relevance: '',
    novelty: '',
    satisfaction: ''
  })

  const loadState = useCallback(() => {
    const songRatingsParam = searchParams.get(`songRatings${step}`)
    const modelRatingsParam = searchParams.get(`modelRatings${step}`)

    if (songRatingsParam) {
      setSongRatings(JSON.parse(songRatingsParam))
    }
    if (modelRatingsParam) {
      setModelRatings(JSON.parse(modelRatingsParam))
    }
  }, [searchParams, step])

  useEffect(() => {
    loadState()
  }, [loadState])

  const saveState = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.set(`songRatings${step}`, JSON.stringify(songRatings))
    url.searchParams.set(`modelRatings${step}`, JSON.stringify(modelRatings))
    window.history.replaceState({}, '', url.toString())
  }, [step, songRatings, modelRatings])

  useEffect(() => {
    const timer = setTimeout(saveState, 500)
    return () => clearTimeout(timer)
  }, [saveState])

  const handleSongRating = useCallback((trackId: number, rating: number) => {
    setSongRatings(prev => {
      const newRatings = { ...prev, [trackId]: rating }
      return JSON.stringify(newRatings) !== JSON.stringify(prev) ? newRatings : prev
    })
  }, [])

  const handleModelRating = useCallback((aspect: keyof ModelRatings, value: string) => {
    setModelRatings(prev => {
      const newRatings = { ...prev, [aspect]: value }
      return JSON.stringify(newRatings) !== JSON.stringify(prev) ? newRatings : prev
    })
  }, [])

  const isAllSongsRated = useMemo(() => Object.keys(songRatings).length === 5, [songRatings])
  const isAllModelRated = useMemo(() => Object.values(modelRatings).every(rating => rating !== ''), [modelRatings])
  const canProceed = isAllSongsRated || isAllModelRated

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-4">Model Evaluation - Step {step} of {totalSteps}</h2>
        <p className="text-muted-foreground">Please rate each recommended song and the overall model performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Playlist />
        <Recommendations onRate={handleSongRating} ratings={songRatings} step={step} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Model Evaluation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base">Relevance: How well do the recommendations match your musical preferences?</Label>
            <RadioGroup
              onValueChange={(value) => handleModelRating('relevance', value)}
              value={modelRatings.relevance}
              className="flex space-x-4 mt-2"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-1">
                  <RadioGroupItem value={rating.toString()} id={`relevance-${rating}`} />
                  <Label htmlFor={`relevance-${rating}`}>{rating}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base">Novelty: How fresh or surprising were the recommendations?</Label>
            <RadioGroup
              onValueChange={(value) => handleModelRating('novelty', value)}
              value={modelRatings.novelty}
              className="flex space-x-4 mt-2"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-1">
                  <RadioGroupItem value={rating.toString()} id={`novelty-${rating}`} />
                  <Label htmlFor={`novelty-${rating}`}>{rating}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base">Satisfaction: How satisfied are you with the overall recommendations?</Label>
            <RadioGroup
              onValueChange={(value) => handleModelRating('satisfaction', value)}
              value={modelRatings.satisfaction}
              className="flex space-x-4 mt-2"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-1">
                  <RadioGroupItem value={rating.toString()} id={`satisfaction-${rating}`} />
                  <Label htmlFor={`satisfaction-${rating}`}>{rating}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNextStep} disabled={!canProceed}>
          {step === totalSteps ? "Complete Study" : "Next Model"}
        </Button>
      </div>
    </div>
  )
}

