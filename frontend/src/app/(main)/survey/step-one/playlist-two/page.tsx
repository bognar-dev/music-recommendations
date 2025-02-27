import { fetchSongs } from '@/db/queries';
import Playlist from '@/components/Playlist';
import StepOneForm from './step-one-form';
const eightiesPlaylist = ["7FwBtcecmlpc1sLySPXeGE", "58mFu3oIpBa0HLNeJIxsw3", "1z3ugFmUKoCzGsI6jdY4Ci", "5vmRQ3zELMLUQPo2FLQ76x", "2374M0fQpWi3dLnB54qaLX", "2iEGj7kAwH7HAa5epwYwLB", "2WfaOiMkCvy7F5fcp2zZ8L"]
const recommendations = ["54bm2e3tk8cliUz3VSdCPZ", "5vmRQ3zELMLUQPo2FLQ76x", "2374M0fQpWi3dLnB54qaLX", "2iEGj7kAwH7HAa5epwYw"]
export default async function StepOne() {
    const playlist = await fetchSongs(eightiesPlaylist);
    const recommendationsList = await fetchSongs(recommendations);
    if (!playlist || !recommendationsList) {
        return <div>Error fetching data</div>;
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <Playlist playlist={playlist.slice(0, 5)} />
            <StepOneForm recommendations={recommendationsList.slice(0, 5)} />
        </div>
    )
}