import React from 'react';
import CircularImages from '@/components/circling-images';
import { fetchSongsWithPagination } from '@/db/queries';
import GooeyButton from '@/components/gooey-button';
import { getTranslations } from 'next-intl/server';
import VariableFontHeadline from '@/components/variable-font-headline';

const Page: React.FC = async () => {
    const t = await getTranslations('HomePage');
    const songs = await fetchSongsWithPagination({ limit: 5, preview_url: true })
    const shuffledSongs = songs.sort(() => Math.random() - 0.5);
    const images = shuffledSongs.slice(0, 18).map(song => song.image_url).filter((url): url is string => url !== null);
    return (
        <div className='min-h-screen flex items-center justify-start'>
            <CircularImages images={images}>
                <div className="flex flex-col items-center justify-start md:justify-center gap-5 md:w-1/4">
                    <div className="text-center text-lg pb-80 md:p-0 md:text-5xl font-azeretMono">
                        <VariableFontHeadline label={t('hero')}/>
                    </div>
                    <GooeyButton 
                        href="terms"
                        className="font-azeretMono font-light text-foreground text-base"
                    >
                        {t('button')}
                    </GooeyButton>
                </div>
            </CircularImages>
        </div>
    );
};

export default Page;