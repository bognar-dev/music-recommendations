"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function acceptTerms() {
        
        const cookieStore = await cookies()
        cookieStore.set('accepted-terms', 'true')
        redirect('/survey')
    }