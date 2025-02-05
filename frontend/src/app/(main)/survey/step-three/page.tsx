import React from 'react';
import StepThreeForm from './step-three-form';
import Playlist from '@/components/Playlist';
import { fetchSongsWithPagination } from '@/db/queries';

export default async function StepThree() {
   const playlist = await fetchSongsWithPagination({ limit: 5, preview_url: true })
      return (
          <div className="grid grid-cols-1 lg:grid-cols-2">
              <Playlist />
              <StepThreeForm recommendations={playlist} />
          </div>
      );
}