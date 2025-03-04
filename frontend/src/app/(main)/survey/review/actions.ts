/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { insertSurvey } from "@/db/queries";
import { postHogServer } from "@/lib/postHog-server";
import {
  stepTenSchema,
  surveySchema,
  type SurveyType,
} from "@/lib/survey-schema";
import { AddDealRoutes } from "@/types/survey";
import type { FormErrors } from "@/types/survey"; // Import FormErrors
import { cookies } from "next/headers";
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

  
  postHogServer.capture({
    distinctId: "server",
    event: "submitSurvey",
    properties: { survey },
  });
  
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
  

  
  const validated = stepTenSchema.safeParse(surveyData.review);

  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
    console.log(errors);
    return errors;
  } 

  
  console.log(surveyData)
  const result = await insertSurvey(surveyData);
  console.log("result", result);
  
  redirect(AddDealRoutes.THANK_YOU);
};
