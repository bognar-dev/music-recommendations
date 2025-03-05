import { getRecommendations, getSeededSong } from '@/db/queries';
import { Suspense } from 'react';
import StepOneForm from './step-one-form';
import { cookies } from 'next/headers';
import MusicSwiperSkeleton from '@/components/music-swiper-skeleton';
export default async function StepOne() {
    const seedSong = await getSeededSong(1);
    const recommendationsList = await getRecommendations(1);
    const cookie = await cookies();
    const modelOrderCookie = cookie.get('model-order');
    const modelOrder = JSON.parse(modelOrderCookie?.value || '[]');
    if (!seedSong || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
           <Suspense fallback={<MusicSwiperSkeleton />}>
                <StepOneForm modelOrder={modelOrder} recommendations={recommendationsList} seededSong={seedSong} />
            </Suspense>
    );
}