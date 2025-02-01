'use client';

import Image from "next/image";
import SubmitButton from "@/components/survey-submit";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Song } from "@/db/schema";
import { Label } from "@/components/ui/label";
import { Play } from "lucide-react";
import { stepOneFormAction } from "./actions";
import { FormErrors } from "@/types/survey";
import Form from "next/form";
import { useActionState } from "react";

interface StepOneFormProps {
    recommendations: Song[]
}

const initialState: FormErrors = {};
export default function StepOneForm({ recommendations }: StepOneFormProps) {
    const [serverErrors, formAction] = useActionState(
        stepOneFormAction,
        initialState
    );

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
                                            />
                                            <Label htmlFor={`relevance-${rating}`}>{rating.toString()}</Label>
                                        </div>
                                    ))}
                                </ul>
                            </div>
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
                                            />
                                            <Label htmlFor={`novelty-${rating}`}>{rating.toString()}</Label>
                                        </div>
                                    ))}
                                </ul>
                            </div>
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