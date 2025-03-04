/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { postHogServer } from '@/lib/postHog-server';
import { stepOneSchema} from '@/lib/survey-schema';
import { AddDealRoutes, FormErrors } from '@/types/survey';
import { redirect } from 'next/navigation';

export const stepOneFormAction = async (
    surveyDataJSON: string,
    _prevState: FormErrors | undefined,
    formData: FormData
): Promise<FormErrors | undefined> => {

    const entries = Array.from(formData.entries());
    const songRatings: any[] = [];
    const modelRating: any = {};
    console.log("formData", formData);
    console.log("entries", entries);


    const surveyDataObj = JSON.parse(surveyDataJSON);
    console.log("surveyDataObj", surveyDataObj.stepOne);    
    const validated = stepOneSchema.safeParse(surveyDataObj.stepOne);
    console.log("surveyData", validated.error);
    
   
    if (!validated.success) {
        const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
            const path = issue.path[0] as string;
            acc[path] = issue.message;
            return acc;
        }, {});
        console.log(errors);
        return errors;
    }


    postHogServer.capture({
        distinctId: "server",
        event: "stepOneFormSubmit",
        properties: { modelRating, songRatings }
    });
    

    redirect(AddDealRoutes.M_1_P2);
};