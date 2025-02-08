import React from 'react';
import CircularImages from '@/components/circling-images';
import { fetchSongsWithPagination } from '@/db/queries';
import { Button } from '@/components/ui/button';
import Link  from 'next/link';

const Page: React.FC = async () => {
    const songs = await fetchSongsWithPagination({ limit: 5, preview_url: true })
    const shuffledSongs = songs.sort(() => Math.random() - 0.5);
    const images = shuffledSongs.slice(0, 18).map(song => song.image_url).filter((url): url is string => url !== null);
    return (
        <div className='min-h-screen'>
            <CircularImages images={images}>
                <div className="flex flex-col items-center justify-start md:justify-center gap-5 md:w-1/4">
                <p className="text-center text-lg pb-80 md:pb-20 md:text-5xl font-azeretMono">
                    Find out if album covers can be used to make music recommendations better for you!
                </p>
                <Button className='font-azeretMono font-light text-foreground'>
                    <Link href='terms'>
                        Start the survey !
                    </Link>
                </Button>
                </div>
            </CircularImages>
        </div>
    );
};

export default Page;