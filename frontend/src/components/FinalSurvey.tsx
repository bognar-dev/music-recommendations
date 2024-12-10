"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface SurveyData {
  usability: string
  clarity: string
  preference: string
  feedback: string
}

export default function FinalSurvey() {
  const searchParams = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<SurveyData>({
    usability: '',
    clarity: '',
    preference: '',
    feedback: ''
  })

  useEffect(() => {
    const surveyData = searchParams.get('surveyData')
    if (surveyData) {
      setFormData(JSON.parse(surveyData))
    }
  }, [searchParams])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('surveyData', JSON.stringify(formData))
    window.history.replaceState({}, '', url)
  }, [formData])

  const handleInputChange = (field: keyof SurveyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the survey data to your backend
    console.log('Survey submitted:', formData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
          <p>Your responses have been recorded. Thank you for participating in this study.</p>
        </CardContent>
      </Card>
    )
  }

  const isFormValid = Object.values(formData).every(value => value !== '')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Final Survey</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="usability">How easy was it to use the interface?</Label>
            <RadioGroup 
              className="flex space-x-4 mt-2" 
              value={formData.usability}
              onValueChange={(value) => handleInputChange('usability', value)}
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-1">
                  <RadioGroupItem value={rating.toString()} id={`usability-${rating}`} />
                  <Label htmlFor={`usability-${rating}`}>{rating}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="clarity">How clear were the recommendations?</Label>
            <RadioGroup 
              className="flex space-x-4 mt-2"
              value={formData.clarity}
              onValueChange={(value) => handleInputChange('clarity', value)}
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-1">
                  <RadioGroupItem value={rating.toString()} id={`clarity-${rating}`} />
                  <Label htmlFor={`clarity-${rating}`}>{rating}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="preference">Which model did you prefer? (1 being the first, 4 being the last)</Label>
            <RadioGroup 
              className="space-y-2 mt-2"
              value={formData.preference}
              onValueChange={(value) => handleInputChange('preference', value)}
            >
              {[1, 2, 3, 4].map((model) => (
                <div key={model} className="flex items-center space-x-2">
                  <RadioGroupItem value={model.toString()} id={`preference-${model}`} />
                  <Label htmlFor={`preference-${model}`}>Model {model}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="feedback">Any additional feedback?</Label>
            <Textarea 
              id="feedback" 
              className="mt-2" 
              value={formData.feedback}
              onChange={(e) => handleInputChange('feedback', e.target.value)}
            />
          </div>
          <Button type="submit" disabled={!isFormValid}>Submit Survey</Button>
        </form>
      </CardContent>
    </Card>
  )
}

