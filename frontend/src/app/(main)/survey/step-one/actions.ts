/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { stepOneSchema } from '@/lib/survey-schema';
import { AddDealRoutes, FormErrors } from '@/types/survey';
import { redirect } from 'next/navigation';

export const stepOneFormAction = async (
    _prevState: FormErrors | undefined,
    formData: FormData
): Promise<FormErrors | undefined> => {
    const entries = Object.entries(formData.entries());
    const songRatings: any[] = [];
    const modelRating: any = {};
    
    entries.forEach(([key, value]) => {
        if (key.startsWith('songRatings.')) {
            const [, index, field] = key.split('.');
            if (!songRatings[parseInt(index)]) songRatings[parseInt(index)] = {};
            songRatings[parseInt(index)][field] = field === 'rating' ? parseInt(value as string) : value;
        } else if (key.startsWith('modelRating.')) {
            const [, field] = key.split('.');
            modelRating[field] = parseInt(value as string);
        }
    });

    const data = {
        songRatings: songRatings.filter(x => x),
        modelRating
    };
    console.log(data)
    const validated = stepOneSchema.safeParse(data);
    console.log(validated.data!);
    if (!validated.success) {
        const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
            const path = issue.path[0] as string;
            acc[path] = issue.message;
            return acc;
        }, {});
        console.log(errors);
        return errors;
    }

    redirect(AddDealRoutes.MODEL_2);
};