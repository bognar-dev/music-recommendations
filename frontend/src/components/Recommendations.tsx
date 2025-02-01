"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { Song } from '@/db/schema'

interface RecommendationsProps {
  className?: string
  recommendations: Song[]
}

const Recommendations: React.FC<RecommendationsProps> = ({recommendations}) => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Tracks</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recommendations.map((track) => (
            <li key={track.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
              <Image
                src={track.image_url!}
                width={64}
                height={64}
                alt={`${track.name} album cover`}
                className="h-16 w-16 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                  <Button size="icon" variant="ghost">
                    <Play className="h-4 w-4" />
                    <span className="sr-only">Play {track.name}</span>
                  </Button>
                </div>
                <RadioGroup
                  className="flex space-x-2"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center space-x-1">
                      <RadioGroupItem required value={rating.toString()} id={`rating-${track.id}-${rating}`} />
                      <Label htmlFor={`rating-${track.id}-${rating}`}>{rating}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

Recommendations.displayName = 'Recommendations'

export default Recommendations