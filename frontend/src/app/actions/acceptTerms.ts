"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function acceptTerms() {
        
        const cookieStore = await cookies()
        cookieStore.set('accepted-terms', 'true')
        const models = ['model1', 'model2', 'model3']
        //shuffle models
        models.sort(() => Math.random() - 0.5)
        cookieStore.set('model-order', JSON.stringify(models))
        redirect('/survey')
    }