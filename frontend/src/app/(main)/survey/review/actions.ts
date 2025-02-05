/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  stepFourSchema,
  surveySchema,
  type SurveyType,
} from "@/lib/survey-schema";
import { AddDealRoutes } from "@/types/survey";
import type { FormErrors } from "@/types/survey"; // Import FormErrors
import { redirect } from "next/navigation";

interface SubmitSurveyActionReturnType {
  redirect?: AddDealRoutes;
  errorMsg?: string;
  success?: boolean;
}

export const submitSurveyAction = async (
  survey: SurveyType
): Promise<SubmitSurveyActionReturnType> => {
  const validated = surveySchema.safeParse(survey);

  if (!validated.success) {
    const errors = validated.error.issues;

    // Check which step has errors and redirect accordingly
    if (errors.some((error) => error.path[0] === "stepOne")) {
      return {
        redirect: AddDealRoutes.MODEL_1,
        errorMsg: "Please validate step 1 information.",
      };
    }
    if (errors.some((error) => error.path[0] === "stepTwo")) {
      return {
        redirect: AddDealRoutes.MODEL_2,
        errorMsg: "Please validate step 2 information.",
      };
    }
    if (errors.some((error) => error.path[0] === "stepThree")) {
      return {
        redirect: AddDealRoutes.MODEL_3,
        errorMsg: "Please validate step 3 information.",
      };
    }
    if (errors.some((error) => error.path[0] === "stepFour")) {
      return {
        redirect: AddDealRoutes.REVIEW_SURVEY,
        errorMsg: "Please validate step 4 information.",
      };
    }

    // If we can't determine which step has errors, redirect to the first step
    return {
      redirect: AddDealRoutes.MODEL_1,
      errorMsg: "Please validate all information.",
    };
  }

  // If validation is successful, you would typically save the data here
  console.log("Validated survey data:", validated.data);

  // For demonstration purposes, we're just logging the data and returning success
  return {
    success: true,
    redirect: AddDealRoutes.THANK_YOU,
  };
};

// The individual step actions remain the same, but here's stepFour as an example:

export const stepFourFormAction = async (
  surveyData: SurveyType,
  _prevState: FormErrors | undefined,
  formData: FormData
): Promise<FormErrors | undefined> => {
  const entries = formData.entries();
  const songRatings: any[] = [];
  const modelRating: any = {};
  let age: number | undefined;
  let country: string | undefined;
  let preference: string | undefined;
  let feedback: string | undefined;

  entries.forEach(([key, value]) => {
    if (key.startsWith("songRatings.")) {
      const [, index, field] = key.split(".");
      if (!songRatings[Number.parseInt(index)])
        songRatings[Number.parseInt(index)] = {};
      songRatings[Number.parseInt(index)][field] =
        field === "rating" || field === "songId"
          ? Number.parseInt(value as string)
          : value;
    } else if (key === "usability" || key === "clarity") {
      modelRating[key] = Number.parseInt(value as string);
    } else if (key === "age") {
      age = Number.parseInt(value as string);
    } else if (key === "country") {
      country = value as string;
    } else if (key === "preference") {
      preference = value as string;
    } else if (key === "feedback") {
      feedback = value as string;
    }
  });

  
  console.log(surveyData)

  // Here you would typically update the survey context with the validated data
  // updateSurveyContext(validated.data);

  // Instead of redirecting, return success
  redirect(AddDealRoutes.THANK_YOU);
};
