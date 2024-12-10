import React, { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const recommendationSets = [
  [
    { id: 1, title: "Shake It Off", artist: "Taylor Swift", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 2, title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 3, title: "Can't Stop the Feeling!", artist: "Justin Timberlake", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 4, title: "Happy", artist: "Pharrell Williams", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 5, title: "Roar", artist: "Katy Perry", albumCover: "/placeholder.svg?height=300&width=300" },
  ],
  [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 2, title: "Don't Start Now", artist: "Dua Lipa", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 3, title: "Watermelon Sugar", artist: "Harry Styles", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 4, title: "Levitating", artist: "Dua Lipa", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 5, title: "Savage Love", artist: "Jason Derulo", albumCover: "/placeholder.svg?height=300&width=300" },
  ],
  [
    { id: 1, title: "Bad Guy", artist: "Billie Eilish", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 2, title: "Old Town Road", artist: "Lil Nas X", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 3, title: "Senorita", artist: "Shawn Mendes & Camila Cabello", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 4, title: "Sunflower", artist: "Post Malone & Swae Lee", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 5, title: "7 Rings", artist: "Ariana Grande", albumCover: "/placeholder.svg?height=300&width=300" },
  ],
  [
    { id: 1, title: "Dance Monkey", artist: "Tones and I", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 2, title: "Someone You Loved", artist: "Lewis Capaldi", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 3, title: "Memories", artist: "Maroon 5", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 4, title: "Circles", artist: "Post Malone", albumCover: "/placeholder.svg?height=300&width=300" },
    { id: 5, title: "Before You Go", artist: "Lewis Capaldi", albumCover: "/placeholder.svg?height=300&width=300" },
  ],
]

interface RecommendationsProps {
  onRate: (trackId: number, rating: number) => void
  ratings: { [key: number]: number }
  step: number
}

const Recommendations: React.FC<RecommendationsProps> = React.memo(({ onRate, ratings, step }) => {
  const recommendations = recommendationSets[step - 1] || recommendationSets[0]

  const handleRating = useCallback((trackId: number, rating: string) => {
    onRate(trackId, parseInt(rating))
  }, [onRate])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Tracks</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {recommendations.map((track) => (
            <li key={track.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
              <img
                src={track.albumCover}
                alt={`${track.title} album cover`}
                className="h-16 w-16 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{track.title}</p>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>
                  <Button size="icon" variant="ghost">
                    <Play className="h-4 w-4" />
                    <span className="sr-only">Play {track.title}</span>
                  </Button>
                </div>
                <RadioGroup
                  onValueChange={(value) => handleRating(track.id, value)}
                  value={ratings[track.id]?.toString()}
                  className="flex space-x-2"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center space-x-1">
                      <RadioGroupItem value={rating.toString()} id={`rating-${track.id}-${rating}`} />
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
})

Recommendations.displayName = 'Recommendations'

export default Recommendations

