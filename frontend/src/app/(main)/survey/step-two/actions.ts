/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { stepTwoSchema } from '@/lib/survey-schema';
import { AddDealRoutes, FormErrors } from '@/types/survey';
import { redirect } from 'next/navigation';

export const stepTwoFormAction = async (
    _prevState: FormErrors | undefined,
    formData: FormData
): Promise<FormErrors | undefined> => {
    const entries = formData.entries();
    const songRatings: any[] = [];
    const modelRating: any = {};
    console.log("formData", formData);
    
    entries.forEach(([key, value]) => {
        if (key.startsWith('songRatings.')) {
            const [, index, field] = key.split('.');
            if (!songRatings[parseInt(index)]) songRatings[parseInt(index)] = {};
            songRatings[parseInt(index)][field] = (field === 'rating' || field === 'songId') ? parseInt(value as string) : value;
        } else if (key.startsWith('modelRating.')) {
            console.log("key", key);
            const [, field] = key.split('.');
            modelRating[field] = parseInt(value as string);
        }
    });
    console.log("modelRating", modelRating);
    console.log("songRatings", songRatings);

    const data = {
        songRatings: songRatings.filter(x => x),
        modelRating,
        modelId: "2",
        step: 2
    };
    
    const validated = stepTwoSchema.safeParse(data);
    console.log("validated", validated.success);
    if (!validated.success) {
        const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
            const path = issue.path[0] as string;
            acc[path] = issue.message;
            return acc;
        }, {});
        console.log(errors);
        return errors;
    }

    redirect(AddDealRoutes.MODEL_3);
};