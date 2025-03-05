
import { getRecommendations, getSeededSong } from '@/db/queries';
import { Suspense } from 'react';
import StepSixForm from './step-six-form';
import MusicSwiperSkeleton from '@/components/music-swiper-skeleton';

export default async function StepSix() {
    const seedSong = await getSeededSong(6);
    const recommendationsList = await getRecommendations(6);
    if (!seedSong || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
        <Suspense fallback={<MusicSwiperSkeleton />}>
            <StepSixForm recommendations={recommendationsList} seededSong={seedSong} />
        </Suspense>
    );
}