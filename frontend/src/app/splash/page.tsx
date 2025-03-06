import CircularImages from '@/components/circling-images';
import StarBorder from '@/components/star-border';
import VerticalCutReveal from '@/components/vertical-cut-reveal';
import { fetchSongs} from '@/db/queries';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import React from 'react';
const songIds = [
    '5LO0sJCkNMZYLYeGOvblLu',
    '6E4DqnxPVMoVrtOyf0DJhG',
    '3PWgD7Gk14tGxHIEK8PQ6o',
    '1Ds58cpyJzL0YTKk02vh1C',
    '052C0m9kD30nZqcPWPPRqm',
    '649o53ULWYN1y7V2OI5kgo',
    '1zFkWtm4zmjB4O3qAokRBX',
    '2aJU5uNgTyV279Tm1eXUhm',
    '10OWv7aQEANHp5D4eRKira',
    '3lPj2nA1lIrWIpbnhNG57v',
    '5Y9fnynLlIvqtM710MHzfz',
    '6lruHh1jF7ezgbLv72xYmf',
    '5CMjjywI0eZMixPeqNd75R',
    '0k6DnZMLoEUH8NGD5zh2SE',
    '1N3rf6ZFzb8NPYeLCmgzj7',
    '4PVipA5hOmX3Su0pQJNt7Y',
    '372wpFKwnTJdVEEIJaFQfu',
    '4joyVm2umM902xqTpRnUhb',
    
];
const Page: React.FC = async () => {
    const t = await getTranslations('HomePage');
    const songs = await fetchSongs(songIds)
    const shuffledSongs = songs.sort(() => Math.random() - 0.5);
    const images = shuffledSongs.slice(0, 18).map(song => song.image_url).filter((url): url is string => url !== null);
    return (
        <div className='min-h-screen flex items-center justify-start select-none'>
            <CircularImages images={images}>
                <div className="flex flex-col items-start md:items-center justify-start md:justify-center gap-5 md:w-1/4">
                    <div className=" flex justify-start items-center flex-col gap-8 text-center text-lg pb-80 md:p-0 md:text-5xl mb-5 font-azeretMono">
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
                        CAN ALBUM COVERS BE USED TO MAKE MUSIC RECOMMENDATIONS

                        </VerticalCutReveal>
                        <p className='text-sm'>Bachelor Thesis Survey</p>
                        <StarBorder
                            as="a"
                            href="terms"
                            onClick={async () => {
                                "use server";
                                const cookieStore = await cookies()
                                cookieStore.delete('accepted-terms')
                                cookieStore.delete('model-order')
                            }}
                            className="align-top font-azeretMono font-light text-foreground text-base mt-32 md:mt-0"
                        >
                            {t('button')}
                        </StarBorder>
                    </div>

                </div>
            </CircularImages>

        </div>
    );
};

export default Page;