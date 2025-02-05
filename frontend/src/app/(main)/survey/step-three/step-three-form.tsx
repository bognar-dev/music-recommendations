'use client';

import Image from "next/image";
import SubmitButton from "@/components/survey-submit";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Song } from "@/db/schema";
import { Label } from "@/components/ui/label";
import { Play } from "lucide-react";
import { stepThreeFormAction } from "./actions";
import { FormErrors } from "@/types/survey";
import Form from "next/form";
import { useActionState } from "react";
import { useSurveyContext } from "@/context/survey-context";


interface StepThreeFormProps {
    recommendations: Song[]
}

const initialState: FormErrors = {};
export default function StepThreeForm({ recommendations }: StepThreeFormProps) {
    const [serverErrors, formAction] = useActionState(
        stepThreeFormAction,
        initialState
    )

    const { updateSurveyDetails, surveyData } = useSurveyContext();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Handle song ratings
        if (name.startsWith('songRatings.')) {
            const [_, songId, field] = name.split('.');
            const existingSongRating = surveyData.stepThree.songRatings.find(
                sr => sr.songId === Number(songId)
            );

            const updatedRating = {
                songId: Number(songId),
                songName: recommendations.find(r => r.id === Number(songId))?.name || '',
                modelId: surveyData.stepThree.modelId,
                rating: Number(value)
            };

            const updatedSongRatings = existingSongRating
                ? surveyData.stepThree.songRatings.map(sr =>
                    sr.songId === Number(songId) ? updatedRating : sr
                )
                : [...surveyData.stepThree.songRatings, updatedRating];

            updateSurveyDetails('stepThree', {
                songRatings: updatedSongRatings
            });
        }

        // Handle model ratings
        if (name.startsWith('modelRating.')) {
            const [_, field] = name.split('.');
            updateSurveyDetails('stepThree', {
                modelRating: {
                    ...surveyData.stepThree.modelRating,
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
                        <CardTitle>Recommended Tracks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {recommendations.slice(0, 3).map((track) => (
                                <li key={track.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                                    <input type="hidden" name={`songRatings.${track.id}.songId`} value={track.id} />
                                    <input type="hidden" name={`songRatings.${track.id}.songName`} value={track.name} />
                                    <Image
                                        src={track.image_url!}
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
                                            <Button size="icon" variant="ghost">
                                                <Play className="h-4 w-4" />
                                                <span className="sr-only">Play {track.name}</span>
                                            </Button>
                                        </div>
                                        <ul className="flex space-x-2">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <div key={rating} className="flex items-center space-x-1">
                                                    <input
                                                        type="radio"
                                                        required
                                                        name={`songRatings.${track.id}.rating`}
                                                        value={rating}
                                                        id={`rating-${track.id}-${rating}`}
                                                        checked={surveyData.stepThree.songRatings.some(
                                                            sr => sr.songId === track.id && sr.rating === rating
                                                        )}
                                                        onChange={handleInputChange}
                                                    />
                                                    <Label htmlFor={`rating-${track.id}-${rating}`}>{rating.toString()}</Label>
                                                </div>
                                            ))}
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
                        <CardTitle>Model Evaluation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Relevance */}
                            <div>
                                <Label htmlFor="relevance">Relevance</Label>
                                <ul className="flex space-x-2 mt-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <div key={rating} className="flex items-center space-x-1">
                                            <input
                                                type="radio"
                                                required
                                                name="modelRating.relevance"
                                                value={rating}
                                                id={`relevance-${rating}`}
                                                checked={surveyData.stepThree.modelRating.relevance === rating}
                                                onChange={handleInputChange}
                                            />
                                            <Label htmlFor={`relevance-${rating}`}>{rating.toString()}</Label>
                                        </div>
                                    ))}
                                </ul>
                            </div>

                            {/* Novelty */}
                            <div>
                                <Label htmlFor="novelty">Novelty</Label>
                                <ul className="flex space-x-2 mt-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <div key={rating} className="flex items-center space-x-1">
                                            <input
                                                type="radio"
                                                required
                                                name="modelRating.novelty"
                                                value={rating}
                                                id={`novelty-${rating}`}
                                                checked={surveyData.stepThree.modelRating.novelty === rating}
                                                onChange={handleInputChange}
                                            />
                                            <Label htmlFor={`novelty-${rating}`}>{rating.toString()}</Label>
                                        </div>
                                    ))}
                                </ul>
                            </div>

                            {/* Satisfaction */}
                            <div>
                                <Label htmlFor="satisfaction">Satisfaction</Label>
                                <ul className="flex space-x-2 mt-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <div key={rating} className="flex items-center space-x-1">
                                            <input
                                                type="radio"
                                                required
                                                name="modelRating.satisfaction"
                                                value={rating}
                                                id={`satisfaction-${rating}`}
                                                checked={surveyData.stepThree.modelRating.satisfaction === rating}
                                                onChange={handleInputChange}
                                            />
                                            <Label htmlFor={`satisfaction-${rating}`}>{rating.toString()}</Label>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </div>
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
    );
}