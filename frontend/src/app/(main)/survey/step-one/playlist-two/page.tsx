import { getRecommendations, getSeededSong } from '@/db/queries';
import { Suspense } from 'react';
import StepTwoForm from './step-two-form';
import MusicSwiperSkeleton from '@/components/music-swiper-skeleton';
export default async function StepTwo() {
    const seedSong = await getSeededSong(2);
        const recommendationsList = await getRecommendations(2);
    if (!seedSong || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
           <Suspense fallback={<MusicSwiperSkeleton />}>
                <StepTwoForm recommendations={recommendationsList} seededSong={seedSong} />
            </Suspense>
    );
}