import { Suspense } from 'react';
import StepSevenForm from './step-seven-form';
import { getRecommendations, getSeededSong } from '@/db/queries';
import MusicSwiperSkeleton from '@/components/music-swiper-skeleton';
export default async function StepSeven() {
    const seedSong = await getSeededSong(7);
    const recommendationsList = await getRecommendations(7);
    if (!seedSong || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
        <Suspense fallback={<MusicSwiperSkeleton />}>
            <StepSevenForm recommendations={recommendationsList} seededSong={seedSong} />
        </Suspense>
    );
}