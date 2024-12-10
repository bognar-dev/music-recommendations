"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function Survey() {
  const [showSurvey, setShowSurvey] = useState(false)

  return (
    <div className="mt-8">
      {!showSurvey ? (
        <Button onClick={() => setShowSurvey(true)}>Complete Post-Interaction Survey</Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Post-Interaction Survey</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div>
                <Label htmlFor="usability">How easy was it to use the interface?</Label>
                <RadioGroup className="flex space-x-4 mt-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center space-x-1">
                      <RadioGroupItem value={rating.toString()} id={`usability-${rating}`} />
                      <Label htmlFor={`usability-${rating}`}>{rating}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="clarity">How clear was the recommendation system?</Label>
                <RadioGroup className="flex space-x-4 mt-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center space-x-1">
                      <RadioGroupItem value={rating.toString()} id={`clarity-${rating}`} />
                      <Label htmlFor={`clarity-${rating}`}>{rating}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="preference">Which recommendation model did you prefer?</Label>
                <RadioGroup className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="audio" id="preference-audio" />
                    <Label htmlFor="preference-audio">Spotify Audio Features</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cover" id="preference-cover" />
                    <Label htmlFor="preference-cover">Album Cover Features</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="combined" id="preference-combined" />
                    <Label htmlFor="preference-combined">Combined Audio and Cover Features</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="baseline" id="preference-baseline" />
                    <Label htmlFor="preference-baseline">Spotify Baseline Model</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="feedback">Any additional feedback?</Label>
                <Textarea id="feedback" className="mt-2" />
              </div>
              <Button type="submit">Submit Survey</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

