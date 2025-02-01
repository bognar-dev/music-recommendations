

import { AddDealRoutes } from '@/types/survey';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AddPage() {
  const cookieStore = await cookies()
  const acceptedTerms = cookieStore.get('accepted-terms')
  if (!acceptedTerms) {
    redirect('/')
  }

  redirect(AddDealRoutes.MODEL_1);
}