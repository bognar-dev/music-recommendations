/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import Image from "next/image"
import SubmitButton from "@/components/survey-submit"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { stepFourFormAction } from "./actions"
import type { FormErrors } from "@/types/survey"
import Form from "next/form"
import { useActionState } from "react"
import { useSurveyContext } from "@/context/survey-context"
import { Country, CountryDropdown } from "@/components/country-select"
import { VinylRating } from "@/components/vinyl-rating"
import { Textarea } from "@/components/ui/textarea"
import AgeInputSlider from "@/components/age-input-slider"
import posthog from "posthog-js"
import { useTranslations } from "next-intl"
import { countries } from "country-data-list"
import { StepTenType, SurveyType } from "@/lib/survey-schema"


const initialState: FormErrors = {}
const modelIdToPreferenceMap: { [key: number]: StepTenType["preference"]} = {
  1: "model1",
  2: "model2",
  3: "model3",
}
export default function StepFourForm() {

  const { updateSurveyDetails, surveyData } = useSurveyContext()
  const [serverErrors, formAction] = useActionState(stepFourFormAction.bind(null, surveyData), initialState)
  const t = useTranslations('Review')
  const submit = () => {
    localStorage.removeItem('surveyData')
    localStorage.removeItem('tutorialComplete')

    posthog.capture('submitted_survey', { property: surveyData })
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Handle song ratings
    if (name.startsWith("songRatings.")) {
      const [_, songId, field] = name.split(".")
    }

    // Handle other fields
    if (["age", "usability", "clarity"].includes(name)) {
      updateSurveyDetails("review", {
        [name]: Number(value),
      })
    }

    if (name === "country" || name === "feedback") {
      updateSurveyDetails("review", {
        [name]: value,
      })
    }

    if (name === "preference") {

      switch (value) {
        case "1":
          const model1 = modelIdToPreferenceMap[Number(surveyData.stepOne.modelId)]
          updateSurveyDetails("review", {
            preference: model1,
          })
          break
        case "2":
          const model2 = modelIdToPreferenceMap[Number(surveyData.stepFour.modelId)]
          updateSurveyDetails("review", {
            preference: model2,
          })
          break
        case "3":
          const model3 = modelIdToPreferenceMap[Number(surveyData.stepThree.modelId)]
          updateSurveyDetails("review", {
            preference: model3,
          })
          break
      }
    }
  }
  return (
    <Form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('userInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AgeInputSlider initialAge={surveyData.review.age} onChange={(value) => updateSurveyDetails("review", { age: Number(value) })} />
              <div>
                <Label htmlFor="country">{t('country')}</Label>
                <CountryDropdown
                  defaultValue={countries.all.find(country => country.alpha3 === surveyData.review.country)?.alpha3}
                  onChange={(country: Country) => updateSurveyDetails("review", { country: country.alpha3 })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Model Evaluation */}
        <Card>
          <CardHeader>
            <CardTitle>{t('modelEval')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Label htmlFor="preference">{t('preference')}</Label>
              <div className="space-y-2 mt-2">
                <VinylRating name="preference" value={surveyData.review.preference} onChange={handleInputChange} range={3} ratingMode="single" />
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>{t('feedback')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="feedback"
              rows={4}
              value={surveyData.review.feedback}
              onChange={handleInputChange}
              placeholder={t('placeholderFeedback')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </CardContent>
        </Card>

        <SubmitButton onClick={submit} text={t('submit')} />
        {serverErrors && (
          <div className="text-red-500 text-sm">
            {Object.entries(serverErrors).map(([key, value]) => (
              <p key={key}>{value}</p>
            ))}
          </div>
        )}
      </div>
    </Form>
  )
}

