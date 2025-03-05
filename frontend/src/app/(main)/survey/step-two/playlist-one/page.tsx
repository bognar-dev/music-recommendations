
import { getRecommendations, getSeededSong } from '@/db/queries';
import { Suspense } from 'react';
import StepFourForm from './step-four-form';
import MusicSwiperSkeleton from '@/components/music-swiper-skeleton';
export default async function StepFour() {
    const seedSong = await getSeededSong(4);
    const recommendationsList = await getRecommendations(4);
    if (!seedSong || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
        <Suspense fallback={<MusicSwiperSkeleton />}>
            <StepFourForm recommendations={recommendationsList} seededSong={seedSong} />
        </Suspense>
    );
}