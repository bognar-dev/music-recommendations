import CircularImages from '@/components/circling-images';
import { ButtonShootingStarBorder } from '@/components/shootingstar-border.tsx';
import VerticalCutReveal from '@/components/vertical-cut-reveal';
import { fetchSongsWithPagination } from '@/db/queries';
import { getTranslations } from 'next-intl/server';
import React from 'react';

const Page: React.FC = async () => {
    const t = await getTranslations('HomePage');
    const songs = await fetchSongsWithPagination({ limit: 5, preview_url: true })
    const shuffledSongs = songs.sort(() => Math.random() - 0.5);
    const images = shuffledSongs.slice(0, 18).map(song => song.image_url).filter((url): url is string => url !== null);
    return (
        <div className='min-h-screen flex items-center justify-start select-none'>
            <CircularImages images={images}>
                <div className="flex flex-col items-start md:items-center justify-start md:justify-center gap-5 md:w-1/4">
                    <div className=" flex justify-center items-center flex-col gap-8 text-center text-lg pb-80 md:p-0 md:text-5xl mb-5 font-azeretMono">
                        <VerticalCutReveal
                            containerClassName='justify-center items-center'
                            splitBy="words"
                            staggerDuration={0.025}
                            staggerFrom="random"
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 21,
                            }}
                        >
                            {t('hero')}

                        </VerticalCutReveal>
                        <ButtonShootingStarBorder
                            href="terms"
                            className="font-azeretMono font-light text-foreground text-base mt-20"
                        >
                            {t('button')}
                        </ButtonShootingStarBorder>
                    </div>

                </div>
            </CircularImages>

        </div>
    );
};

export default Page;