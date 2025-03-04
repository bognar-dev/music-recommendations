/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Song } from "@/db/schema";
import { stepFourFormAction } from "./actions";
import { FormErrors } from "@/types/survey";
import Form from "next/form";
import { useActionState } from "react";
import { useSurveyContext } from "@/context/survey-context";
import { useTranslations } from 'next-intl';
import MusicSwiper from "@/components/music-swiper";


interface StepFourFormProps {
    recommendations: Song[],
    seededSong: Song,
}

const initialState: FormErrors = {};
export default function StepFourForm({ recommendations,seededSong}: StepFourFormProps) {
    
    const t = useTranslations('StepForm');
    const { updateSurveyDetails, surveyData } = useSurveyContext();
    const updatedStepFourFormAction = stepFourFormAction.bind(null,JSON.stringify(surveyData))
    const [serverErrors, formAction] = useActionState(
        updatedStepFourFormAction,
        initialState
    )

    
    return (
        <Form action={formAction} className="flex flex-col items-center justify-items-center">
            <MusicSwiper seedSong={seededSong} recommendations={recommendations}  step="stepFour"  />
        </Form>
    );
}