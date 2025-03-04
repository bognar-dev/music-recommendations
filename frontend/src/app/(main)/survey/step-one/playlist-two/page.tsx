import { fetchSongBySpotifyId, fetchSongs } from '@/db/queries';
import { Suspense } from 'react';
import StepTwoForm from './step-two-form';
const seedSongId = "7FwBtcecmlpc1sLySPXeGE"
const recommendations = ["54bm2e3tk8cliUz3VSdCPZ", "5vmRQ3zELMLUQPo2FLQ76x", "2374M0fQpWi3dLnB54qaLX", "2iEGj7kAwH7HAa5epwYw","7FwBtcecmlpc1sLySPXeGE", "58mFu3oIpBa0HLNeJIxsw3", "1z3ugFmUKoCzGsI6jdY4Ci", "5vmRQ3zELMLUQPo2FLQ76x", "2374M0fQpWi3dLnB54qaLX", "2iEGj7kAwH7HAa5epwYwLB", "2WfaOiMkCvy7F5fcp2zZ8L"]
export default async function StepTwo() {
    const seedSong = await fetchSongBySpotifyId(seedSongId);
    const recommendationsList = await fetchSongs(recommendations);
    if (!seedSong || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
           <Suspense fallback={<div>Loading...</div>}>
                <StepTwoForm recommendations={recommendationsList} seededSong={seedSong} />
            </Suspense>
    );
}