/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import { Song } from "@/db/schema";
import { stepThreeFormAction } from "./actions";
import { FormErrors } from "@/types/survey";
import Form from "next/form";
import { useActionState } from "react";
import { useSurveyContext } from "@/context/survey-context";
import { useTranslations } from 'next-intl';
import MusicSwiper from "@/components/music-swiper";


interface StepThreeFormProps {
    recommendations: Song[],
    seededSong: Song,
}

const initialState: FormErrors = {};
export default function StepThreeForm({ recommendations,seededSong}: StepThreeFormProps) {
    
    const t = useTranslations('StepForm');
    const { updateSurveyDetails, surveyData } = useSurveyContext();
    const updatedStepThreeFormAction = stepThreeFormAction.bind(null,JSON.stringify(surveyData))
    const [serverErrors, formAction] = useActionState(
        updatedStepThreeFormAction,
        initialState
    )

    
    return (
        <Form action={formAction} className="flex flex-col items-center justify-items-center">
            <MusicSwiper seedSong={seededSong} recommendations={recommendations}  step="stepThree"  />
        </Form>
    );
}