import { fetchSongBySpotifyId, fetchSongs } from '@/db/queries';
import { Suspense } from 'react';
import StepOneForm from './step-one-form';
import {recommendations} from '@/data/recommendations';
export default async function StepOne() {
    const seedSong = await fetchSongBySpotifyId(recommendations.model1playlist1.seededSong);
    const recommendationsList = await fetchSongs(recommendations.model1playlist1.recommendations);
    console.log(recommendationsList.length)
    if (!seedSong || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
           <Suspense fallback={<div>Loading...</div>}>
                <StepOneForm recommendations={recommendationsList} seededSong={seedSong} />
            </Suspense>
    );
}