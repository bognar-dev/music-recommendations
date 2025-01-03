"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import {
  MultiStepForm,
  MultiStepFormStep,
  MultiStepFormHeader,
  MultiStepFormFooter,
  MultiStepFormContextProvider,
  createStepSchema
} from '@/components/ui/multi-step-form'
import {Button} from "@/components/ui/button"
import Recommendations from "@/components/Recommendations"
import ModelEvaluation from "@/components/ModelEvaluation"
import Playlist from '@/components/Playlist'
import FinalSurvey from "@/components/FinalSurvey"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const FormSchema = createStepSchema({
  step1: z.object({
    songRatings: z.record(z.string(), z.number()),
    modelRatings: z.object({
      relevance: z.string().min(1),
      novelty: z.string().min(1),
      satisfaction: z.string().min(1)
    })
  }),
  step2: z.object({
    songRatings: z.record(z.string(), z.number()),
    modelRatings: z.object({
      relevance: z.string().min(1),
      novelty: z.string().min(1),
      satisfaction: z.string().min(1)
    })
  }),
  step3: z.object({
    songRatings: z.record(z.string(), z.number()),
    modelRatings: z.object({
      relevance: z.string().min(1),
      novelty: z.string().min(1),
      satisfaction: z.string().min(1)
    })
  }),
  finalSurvey: z.object({
    usability: z.string().min(1),
    clarity: z.string().min(1),
    preference: z.string().min(1),
    feedback: z.string()
  })
})

type FormValues = z.infer<typeof FormSchema>

export default function Home() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      step1: { songRatings: {}, modelRatings: { relevance: '', novelty: '', satisfaction: '' } },
      step2: { songRatings: {}, modelRatings: { relevance: '', novelty: '', satisfaction: '' } },
      step3: { songRatings: {}, modelRatings: { relevance: '', novelty: '', satisfaction: '' } },
      finalSurvey: { usability: '', clarity: '', preference: '', feedback: '' }
    }
  })

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex h-screen pb-24">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Header />
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Thank You!</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your responses have been recorded. Thank you for participating in this study.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen pb-24">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <MultiStepForm
              schema={FormSchema}
              form={form}
              onSubmit={onSubmit}
              className="space-y-8"
            >
   <MultiStepFormHeader>
  <div className="space-y-4">
    <div>
      <h2 className="text-3xl font-bold mb-4">Music Recommendation Study</h2>
      <p className="text-muted-foreground">
        Please evaluate each model and complete the final survey.
      </p>
    </div>
    <StepProgress />
  </div>
</MultiStepFormHeader>

              {[1, 2, 3].map((step) => (
                <MultiStepFormStep key={step} name={`step${step}`}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Model {step} Evaluation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Playlist />
                        <Recommendations step={step} stepKey={`step${step}`} />
                        <ModelEvaluation step={step} stepKey={`step${step}`} />
                      </div>
                    </CardContent>
                  </Card>
                </MultiStepFormStep>
              ))}

              <MultiStepFormStep name="finalSurvey">
                <FinalSurvey />
              </MultiStepFormStep>
              <MultiStepFormFooter id="">
  <Button type="submit">
    HI
  </Button>
</MultiStepFormFooter>
            
            </MultiStepForm>
          </div>
        </div>
      </main>
    </div>
  )
}



export function StepProgress() {
  return (
    <MultiStepFormContextProvider>
      {(ctx) => (
        <div className="flex gap-2">
          {Array.from({ length: ctx.totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i <= ctx.currentStepIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      )}
    </MultiStepFormContextProvider>
  )
}