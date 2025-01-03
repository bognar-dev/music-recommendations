import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useMultiStepFormContext } from '@/components/ui/multi-step-form'

interface ModelEvaluationProps {
  step: number
  stepKey: `step${number}`
}

const ModelEvaluation: React.FC<ModelEvaluationProps> = ({ step, stepKey }) => {
  const { form } = useMultiStepFormContext()

  const ratings = [
    {
      id: 'relevance',
      label: 'Relevance: How well do the recommendations match your musical preferences?'
    },
    {
      id: 'novelty',
      label: 'Novelty: How fresh or surprising were the recommendations?'  
    },
    {
      id: 'satisfaction',
      label: 'Satisfaction: How satisfied are you with the overall recommendations?'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model {step} Evaluation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {ratings.map((rating) => (
          <div key={rating.id}>
            <Label className="text-base" htmlFor={`${rating.id}-${step}`}>
              {rating.label}
            </Label>
            <RadioGroup
              id={`${rating.id}-${step}`}
              onValueChange={(value) => {
                form.setValue(`${stepKey}.modelRatings.${rating.id}`, value)
              }}
              value={form.watch(`${stepKey}.modelRatings.${rating.id}`)}
              className="flex space-x-4 mt-2"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-1">
                  <RadioGroupItem 
                    value={value.toString()} 
                    id={`${rating.id}-${step}-${value}`}
                  />
                  <Label htmlFor={`${rating.id}-${step}-${value}`}>
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

ModelEvaluation.displayName = 'ModelEvaluation'

export default ModelEvaluation