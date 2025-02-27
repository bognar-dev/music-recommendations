import React from 'react';
import StepTwoForm from './step-two-form';
import Playlist from '@/components/Playlist';
import { fetchSongsWithPagination } from '@/db/queries';

export default async function StepOne() {

    const playlist = await fetchSongsWithPagination({ limit: 5, preview_url: true })
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Playlist playlist={playlist.slice(0, 5)}  />
            <StepTwoForm recommendations={playlist.slice(0, 5)} />
        </div>
    );
}