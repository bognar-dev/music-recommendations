import { AddDealRoutes } from '@/types/survey';
import { redirect } from 'next/navigation';
export default async function StepOne() {
    redirect(AddDealRoutes.M_2_P1);
}