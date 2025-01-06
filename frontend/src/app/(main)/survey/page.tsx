

import Playlist from "@/components/Playlist";
import SurveryPage from "@/components/survey-page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function Home() {
  const cookieStore = await cookies()
  const acceptedTerms = cookieStore.get('accepted-terms')
  if(!acceptedTerms) {
    redirect('/')
  }
  return (
    <SurveryPage>
      <Playlist />
    </SurveryPage>
  )
}