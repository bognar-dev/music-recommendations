import { getRecommendations, getSeededSong } from '@/db/queries';
import { Suspense } from 'react';
import StepNineForm from './step-nine-form';
import MusicSwiperSkeleton from '@/components/music-swiper-skeleton';

export default async function StepNine() {
    const seedSong = await getSeededSong(9);
    const recommendationsList = await getRecommendations(9);
    if (!seedSong || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
        <Suspense fallback={<MusicSwiperSkeleton />}>
            <StepNineForm recommendations={recommendationsList} seededSong={seedSong} />
        </Suspense>
    );
}