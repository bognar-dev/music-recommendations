/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Song } from "@/db/schema";
import { stepOneFormAction } from "./actions";
import { FormErrors } from "@/types/survey";
import Form from "next/form";
import { useActionState, useEffect } from "react";
import { useSurveyContext } from "@/context/survey-context";
import { useTranslations } from 'next-intl';
import MusicSwiper from "@/components/music-swiper";


interface StepOneFormProps {
    recommendations: Song[],
    seededSong: Song,
    modelOrder: string[],  // added modelOrder to the props
}

const initialState: FormErrors = {};
export default function StepOneForm({ recommendations, seededSong, modelOrder }: StepOneFormProps) {
    const t = useTranslations('StepForm');
    const { updateSurveyDetails,setModelOrder, surveyData } = useSurveyContext();
    
    const updatedStepOneFormAction = stepOneFormAction.bind(null,JSON.stringify(surveyData))
    const [serverErrors, formAction] = useActionState(
        updatedStepOneFormAction,
        initialState
    )


    useEffect(() => {
        setModelOrder(modelOrder);
    }, [modelOrder, setModelOrder])
    
    return (
        <Form action={formAction} className="flex flex-col items-center justify-items-center">
            <MusicSwiper seedSong={seededSong} recommendations={recommendations}  step="stepOne"  />
        </Form>
    );
}