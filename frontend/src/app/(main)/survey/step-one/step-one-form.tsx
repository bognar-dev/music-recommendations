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


interface StepOneFormProps {
    recommendations: Song[]
}

const initialState: FormErrors = {};
export default function StepOneForm({ recommendations }: StepOneFormProps) {
    const [serverErrors, formAction] = useActionState(
        stepOneFormAction,
        initialState
    )
    const t = useTranslations('StepForm');
    const { updateSurveyDetails, surveyData } = useSurveyContext();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        posthog.capture('my event', { property: 'value' })
        const { name, value } = e.target;

        // Handle song ratings
        if (name.startsWith('songRatings.')) {
            const [_, songId, field] = name.split('.');
            const existingSongRating = surveyData.stepOne.songRatings.find(
                sr => sr.songId === Number(songId)
            );

            const updatedRating = {
                songId: Number(songId),
                songName: recommendations.find(r => r.id === Number(songId))?.name || '',
                modelId: surveyData.stepOne.modelId,
                rating: Number(value)
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
        <Form action={formAction} className="flex flex-1 flex-col items-center">
            <div className="flex w-full flex-col gap-8 lg:max-w-[700px]">
                {/* Song Ratings */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('recommendedTracks')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {recommendations.slice(0, 3).map((track) => (
                                <li key={track.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                                    <input type="hidden" name={`songRatings.${track.id}.songId`} value={track.id} />
                                    <input type="hidden" name={`songRatings.${track.id}.songName`} value={track.name} />
                                    <Image
                                        src={track.image_url && track.image_url !== "no" ? track.image_url : '/placeholder.svg'}
                                        width={64}
                                        height={64}
                                        alt={`${track.name} album cover`}
                                        className="h-16 w-16 rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-medium">{track.name}</p>
                                                <p className="text-sm text-muted-foreground">{track.artist}</p>
                                            </div>
                                            <PlayButton song={track}/>
                                        </div>
                                        <ul className="flex space-x-2">
                                           <VinylRating name={`songRatings.${track.id}.rating`} value={surveyData.stepOne.songRatings.find(sr => sr.songId === track.id)?.rating || 0} onChange={handleInputChange} />
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Model Ratings */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('modelEvaluation')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Relevance */}
                            <div>
                                <Label htmlFor="relevance">{t('relevance')}</Label>
                                <ul className="flex space-x-2 mt-2">
                                    <VinylRating name="modelRating.relevance" value={surveyData.stepOne.modelRating.relevance} onChange={handleInputChange} />
                                </ul>
                            </div>

                            {/* Novelty */}
                            <div>
                                <Label htmlFor="novelty">{t('novelty')}</Label>
                                <ul className="flex space-x-2 mt-2">
                                    <VinylRating name="modelRating.novelty" value={surveyData.stepOne.modelRating.novelty} onChange={handleInputChange} />
                                </ul>
                            </div>

                            {/* Satisfaction */}
                            <div>
                                <Label htmlFor="satisfaction">{t('satisfaction')}</Label>
                                <ul className="flex space-x-2 mt-2">
                                    <VinylRating name="modelRating.satisfaction" value={surveyData.stepOne.modelRating.satisfaction} onChange={handleInputChange} />
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <SubmitButton text={t('submit')} />
                {serverErrors && (
                    <div className="text-red-500 text-sm">
                        {Object.entries(serverErrors).map(([key, value]) => (
                            <p key={key}>{value}</p>
                        ))}
                    </div>
                )}
            </div>
        </Form>
    );
}