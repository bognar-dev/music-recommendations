
import { getRecommendations, getSeededSong } from '@/db/queries';
import { Suspense } from 'react';
import StepFiveForm from './step-five-form';
import MusicSwiperSkeleton from '@/components/music-swiper-skeleton';
export default async function StepFive() {
    const seedSong = await getSeededSong(5);
    const recommendationsList = await getRecommendations(5);
    if (!seedSong || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
        <Suspense fallback={<MusicSwiperSkeleton />}>
            <StepFiveForm recommendations={recommendationsList} seededSong={seedSong} />
        </Suspense>
    );
}