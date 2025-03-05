import { getRecommendations, getSeededSong } from '@/db/queries';
import { Suspense } from 'react';
import StepThreeForm from './step-three-form';
import MusicSwiperSkeleton from '@/components/music-swiper-skeleton';

export default async function StepThree() {
    const seedSong = await getSeededSong(3);
    const recommendationsList = await getRecommendations(3);
    if (!seedSong || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
        <Suspense fallback={<MusicSwiperSkeleton />}>
            <StepThreeForm recommendations={recommendationsList} seededSong={seedSong} />
        </Suspense>
    );
}