import React from 'react';
import StepOneForm from './step-one-form';
import Playlist from '@/components/Playlist';
import { fetchSongsWithPagination } from '@/db/queries';

export default async function StepOne() {

    const playlist = await fetchSongsWithPagination({ limit: 5, preview_url: true })
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Playlist />
            <StepOneForm recommendations={playlist} />
        </div>
    );
}