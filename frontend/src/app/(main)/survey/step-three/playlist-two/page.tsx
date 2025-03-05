
import { getRecommendations, getSeededSong } from '@/db/queries';
import { Suspense } from 'react';
import StepEightForm from './step-eight-form';
import MusicSwiperSkeleton from '@/components/music-swiper-skeleton';
export default async function StepEight() {
    const seedSong = await getSeededSong(8);
    const recommendationsList = await getRecommendations(8);
    if (!seedSong || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
        <Suspense fallback={<MusicSwiperSkeleton />}>
            <StepEightForm recommendations={recommendationsList} seededSong={seedSong} />
        </Suspense>
    );
}