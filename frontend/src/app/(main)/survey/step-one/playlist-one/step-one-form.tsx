/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from "next/image";
import SubmitButton from "@/components/survey-submit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Song } from "@/db/schema";
import { Label } from "@/components/ui/label";
import { stepOneFormAction } from "./actions";
import { FormErrors } from "@/types/survey";
import Form from "next/form";
import { useActionState } from "react";
import { useSurveyContext } from "@/context/survey-context";
import { VinylRating } from "@/components/vinyl-rating";
import { PlayButton } from "@/components/play-button";
import posthog from "posthog-js";
import { useTranslations } from 'next-intl';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import MusicSwiper from "@/components/music-swiper";


interface StepOneFormProps {
    recommendations: Song[],
    seededSong: Song,
}

const initialState: FormErrors = {};
export default function StepOneForm({ recommendations,seededSong}: StepOneFormProps) {
    
    const t = useTranslations('StepForm');
    const { updateSurveyDetails, surveyData } = useSurveyContext();
    const updatedStepOneFormAction = stepOneFormAction.bind(null,JSON.stringify(surveyData))
    const [serverErrors, formAction] = useActionState(
        updatedStepOneFormAction,
        initialState
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        
        // Handle song ratings (boolean: liked/disliked)
        if (name.startsWith('songRatings.')) {
            const [_, songId, field] = name.split('.');
            const existingSongRating = surveyData.stepOne.songRatings.find(
                sr => sr.songId === Number(songId)
            );
            
            // Use checked property for boolean value
            const updatedRating = {
                songId: Number(songId),
                songName: recommendations.find(r => r.id === Number(songId))?.name || '',
                modelId: surveyData.stepOne.modelId,
                rating: checked // Boolean value from checkbox
            };

            const updatedSongRatings = existingSongRating
                ? surveyData.stepOne.songRatings.map(sr =>
                    sr.songId === Number(songId) ? updatedRating : sr
                )
                : [...surveyData.stepOne.songRatings, updatedRating];

            updateSurveyDetails('stepOne', {
                songRatings: updatedSongRatings
            });
        }

        // Handle model ratings
        if (name.startsWith('modelRating.')) {
            const [_, field] = name.split('.');
            updateSurveyDetails('stepOne', {
                modelRating: {
                    ...surveyData.stepOne.modelRating,
                    [field]: Number(value)
                }
            });
        }
    };
    return (
        <Form action={formAction} className="flex flex-col items-center justify-items-center">
            <MusicSwiper seedSong={seededSong} recommendations={recommendations} handleInputChange={handleInputChange}  />

                
        </Form>
    );
}