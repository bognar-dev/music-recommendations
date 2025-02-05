"use client"

import Image from "next/image"
import SubmitButton from "@/components/survey-submit"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Play } from "lucide-react"
import { stepFourFormAction } from "./actions"
import type { FormErrors } from "@/types/survey"
import Form from "next/form"
import { useActionState } from "react"
import { useSurveyContext } from "@/context/survey-context"
import { CountrySelect } from "@/components/country-select"
import { VinylRating } from "@/components/vinyl-rating"
import { Textarea } from "@/components/ui/textarea"


const initialState: FormErrors = {}

export default function StepFourForm() {
  
  const { updateSurveyDetails, surveyData } = useSurveyContext()
  const [serverErrors, formAction] = useActionState(stepFourFormAction.bind(null, surveyData), initialState)




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Handle song ratings
    if (name.startsWith("songRatings.")) {
      const [_, songId, field] = name.split(".")
    }

    // Handle other fields
    if (["age", "usability", "clarity"].includes(name)) {
      updateSurveyDetails("stepFour", {
        [name]: Number(value),
      })
    }

    if (name === "country" || name === "feedback") {
      updateSurveyDetails("stepFour", {
        [name]: value,
      })
    }

    if (name === "preference") {
      updateSurveyDetails("stepFour", {
        preference: value as "model1" | "model2" | "model3",
      })
    }
  }

  return (
    <Form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="13"
                  max="120"
                  value={surveyData.stepFour.age || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <CountrySelect
                  value={surveyData.stepFour.country}
                  onChange={(value) => updateSurveyDetails("stepFour", { country: value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Model Evaluation */}
        <Card>
          <CardHeader>
            <CardTitle>Model Evaluation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="preference">Preferred Recommendation Model</Label>
                <div className="space-y-2 mt-2">
                  {["model1", "model2", "model3"].map((model) => (
                    <div key={model} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`preference-${model}`}
                        name="preference"
                        value={model}
                        checked={surveyData.stepFour.preference === model}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <Label htmlFor={`preference-${model}`}>
                        {model === "model1"
                          ? "Model 1 (Genre-based)"
                          : model === "model2"
                            ? "Model 2 (Collaborative Filtering)"
                            : "Model 3 (Hybrid Approach)"}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="feedback"
              rows={4}
              value={surveyData.stepFour.feedback}
              onChange={handleInputChange}
              placeholder="Please provide any additional feedback..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </CardContent>
        </Card>

        <SubmitButton text="Submit" />
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

