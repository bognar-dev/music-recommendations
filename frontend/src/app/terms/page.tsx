"use client";
import acceptTerms from '@/app/actions/acceptTerms';
import StarButton from '@/components/star-border';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Form from 'next/form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const TermsPage = () => {
    const router = useRouter();
    const t = useTranslations('TermsPage');

    useEffect(() => {
        if (document.cookie.includes('accepted-terms=true')) {
            router.push('/survey');
        }
    }, [router]);

    // Define the order of term keys to preserve ordering
    const termKeys = ['purpose', 'userAgreement', 'privacyData', 'voluntary', 'risksBenefits', 'contact'];
    // Explicitly retrieve title and content for each term
    const terms = termKeys.map(key => ({
        title: t(`terms.${key}.title`),
        content: t(`terms.${key}.content`)
    }));

    const scrollToBottom = () => {
        const bottom = document.getElementById('bottom');
        if (bottom) {
            bottom.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const removeSurveyData = () => {
        localStorage.removeItem('surveyData');
        localStorage.removeItem('tutorialComplete');
    } 

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-6 bg-background text-foreground">
            <div className="fixed bottom-4 right-4 md:hidden z-50">
                <Button
                    className="rounded-full shadow-lg"
                    onClick={scrollToBottom}
                >
                    <ChevronDown className="h-6 w-6" />
                </Button>
            </div>
            <div className="w-full max-w-4xl text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                    {t('title')}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                    {t('description')}
                </p>
                <Tabs defaultValue="tab2" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="tab1">{t('keyTerms')}</TabsTrigger>
                        <TabsTrigger value="tab2">{t('guideTab')}</TabsTrigger>
                        <TabsTrigger value="tab3">{t('fullTerms')}</TabsTrigger>
                    </TabsList>
                    <div className="flex justify-center mt-8" id="top">
                        <Form action={acceptTerms}>
                            <StarButton as='button' className="font-azeretMono font-light text-foreground text-base" onClick={removeSurveyData}>
                                {t('agreeButton')}
                            </StarButton>
                        </Form>
                    </div>
                    <TabsContent value="tab1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {terms.map((term, index) => (
                                <div key={index} className="bg-card/50 backdrop-blur-sm p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold text-primary mb-2">
                                        {term.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">{term.content}</p>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="tab2">
                        <div className="bg-card/50 backdrop-blur-sm p-4 rounded-lg">
                        <iframe src="https://scribehow.com/embed/How_To_Complete_the_Music_Recommendations_Survey__ZdLK9f-JTRiC7FSAr6t3MA?skipIntro=true" width="100%" height="640" allowFullScreen frameBorder="0"></iframe>
                            <section className="text-center">
                                <h2 className="text-2xl font-semibold text-primary mb-4">{t('guide.title')}</h2>
                                <p className="mb-6 text-md text-muted-foreground">{t('guide.intro')}</p>
                            </section>

                            <section className="mb-4">
                                <h3 className="text-xl font-semibold text-primary mb-3">{t('guide.gettingStarted.title')}</h3>
                                <p className="mb-3 text-sm text-muted-foreground">{t('guide.gettingStarted.structure')}</p>
                                <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                                    <li>{t('guide.steps.step1')}</li>
                                    <li>{t('guide.steps.step2')}</li>
                                    <li>{t('guide.steps.step3')}</li>
                                    <li>{t('guide.steps.final')}</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h3 className="text-xl font-semibold text-primary mb-3">{t('guide.stepByStep.title')}</h3>
                                <ol className="list-decimal list-inside ml-4 space-y-2 text-sm text-muted-foreground">
                                    <li>{t('guide.stepByStep.reviewSeed')}</li>
                                    <li>
                                        {t('guide.stepByStep.forEachSong')}
                                        <ul className="list-none list-inside ml-6 space-y-1 mt-1">
                                            <li>{t('guide.stepByStep.listenPreview')}</li>
                                            <li>{t('guide.stepByStep.evaluate')}</li>
                                            <li>{t('guide.stepByStep.swipeAction')}</li>
                                        </ul>
                                    </li>
                                    <li>
                                        {t('guide.stepByStep.afterReview')}
                                        <ul className="list-none list-inside ml-6 space-y-1 mt-1">
                                            <li>{t('guide.stepByStep.rateModel')}</li>
                                            <li>{t('guide.stepByStep.submit')}</li>
                                        </ul>
                                    </li>
                                    <li>{t('guide.stepByStep.repeat')}</li>
                                </ol>
                            </section>

                            <section className="mb-4">
                                <h3 className="text-xl font-semibold text-primary mb-3">{t('guide.musicSwiper.title')}</h3>
                                <h4 className="text-lg font-medium text-primary mb-3">{t('guide.musicSwiper.subtitle')}</h4>
                                <ul className="list-none list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                                    <li>{t('guide.features.seedSong')}</li>
                                    <li>
                                        {t('guide.features.swipingInterface')}
                                        <ul className="list-circle list-inside ml-6 space-y-1">
                                            <li>{t('guide.features.swipeRight')}</li>
                                            <li>{t('guide.features.swipeLeft')}</li>
                                            <li>{t('guide.features.vibration')}</li>
                                        </ul>
                                    </li>
                                    <li>{t('guide.features.undo')}</li>
                                    <li>{t('guide.features.progress')}</li>
                                    <li>{t('guide.features.completion')}</li>
                                </ul>
                            </section>



                            <section className="mb-4">
                                <h4 className="text-lg font-medium text-primary mb-3">{t('guide.completion.title')}</h4>
                                <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                                    <li>{t('guide.completion.preferred')}</li>
                                    <li>{t('guide.completion.demographics')}</li>
                                    <li>{t('guide.completion.feedback')}</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h3 className="text-xl font-semibold text-primary mb-3">{t('guide.tips.title')}</h3>
                                <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                                    <li>{t('guide.tips.listen')}</li>
                                    <li>{t('guide.tips.undo')}</li>
                                    <li>{t('guide.tips.takeTime')}</li>
                                    <li>{t('guide.tips.completeSteps')}</li>
                                    <li>{t('guide.tips.consistent')}</li>
                                </ul>
                            </section>

                            <section className="mb-4">
                                <h3 className="text-xl font-semibold text-primary mb-3">{t('guide.technical.title')}</h3>
                                <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-muted-foreground">
                                    <li>{t('guide.technical.progress')}</li>
                                    <li>{t('guide.technical.pause')}</li>
                                    <li>{t('guide.technical.submitted')}</li>
                                    <li>{t('guide.technical.results')}</li>
                                </ul>
                            </section>

                            <section className="text-center">
                                <p className="italic mt-6 text-md text-muted-foreground">{t('guide.thanks')}</p>
                            </section>
                        </div>
                    </TabsContent>
                    <TabsContent value="tab3">
                        <div className="bg-card/50 backdrop-blur-sm p-4 rounded-lg prose prose-sm max-w-none">
                            <h2 className='text-2xl font-semibold text-primary mb-3'>Full Terms and Conditions</h2>
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-primary mb-3">1. Acceptance of Terms</h3>
                                <p className="">By accessing and participating in this study, you agree to comply with the terms and conditions outlined herein. If you do not agree with any of these terms, you must not participate in the study.</p>

                                <h3 className="text-xl font-semibold text-primary mb-3">2. Description of the Study</h3>
                                <p className="">This study investigates the impact of album cover features on music recommendations. Participants will interact with a recommendation system and provide feedback on relevance, novelty, and satisfaction. The study is conducted for research purposes and is not associated with any commercial music streaming service.</p>

                                <h3 className="text-xl font-semibold text-primary mb-3">3. Participant Eligibility</h3>
                                <p className="">Participants must be at least 18 years old and have a general familiarity with music streaming services. Participation is voluntary, and participants may withdraw at any time without penalty.</p>

                                <h3 className="text-xl font-semibold text-primary mb-3">4. Data Collection and Usage</h3>
                                <div className="space-y-2">
                                    <p className="">4.1. The study will collect user responses, including ratings of recommended music tracks and optional feedback through surveys.</p>
                                    <p className="">4.2. No personally identifiable information will be collected unless explicitly stated and agreed upon.</p>
                                    <p className="">4.3. All data will be anonymized and used solely for research purposes in accordance with ethical guidelines and UK data protection laws.</p>
                                    <p className="">4.4. Participants may request the deletion of their data at any time by contacting the study administrator.</p>
                                </div>

                                <h3 className="text-xl font-semibold text-primary mb-3">5. Privacy and Confidentiality</h3>
                                <div className="space-y-2">
                                    <p className="">5.1. Data collected will be securely stored and encrypted to prevent unauthorized access.</p>
                                    <p className="">5.2. Study results may be published, but individual participant data will remain anonymous.</p>
                                    <p className="">5.3. Third-party services used for hosting the study website (e.g., Vercel) may have their own data handling policies. Participants are encouraged to review these policies separately.</p>
                                </div>

                                <h3 className="text-xl font-semibold text-primary mb-3">6. Participant Responsibilities</h3>
                                <div className="space-y-2">
                                    <p className="">6.1. Participants agree to provide honest and thoughtful responses.</p>
                                    <p className="">6.2. Participants must not attempt to manipulate or interfere with the study’s functionality in any way.</p>
                                    <p className="">6.3. Any abusive or inappropriate behavior will result in exclusion from the study.</p>
                                </div>

                                <h3 className="text-xl font-semibold text-primary mb-3">7. Risks and Disclaimers</h3>
                                <div className="space-y-2">
                                    <p className="">7.1. This study poses minimal risk, involving only the evaluation of music recommendations.</p>
                                    <p className="">7.2. The study is provided &quot;as is&quot; without warranties of any kind. The researchers are not responsible for any technical issues, data loss, or unintended consequences arising from participation.</p>
                                </div>

                                <h3 className="text-xl font-semibold text-primary mb-3">8. Withdrawal from the Study</h3>
                                <p className="">Participants may withdraw at any time by closing the study webpage. If a participant wishes to have their responses removed, they may contact the research team via the provided email.</p>

                                <h3 className="text-xl font-semibold text-primary mb-3">9. Ethical Considerations</h3>
                                <div className="space-y-2">
                                    <p className="">9.1. This study complies with the ethical guidelines set forth by Falmouth University and the British Computer Society (BCS).</p>
                                    <p className="">9.2. The research has been reviewed and approved in accordance with institutional ethics requirements.</p>
                                </div>

                                <h3 className="text-xl font-semibold text-primary mb-3">10. Contact Information</h3>
                                <p className="">For questions or concerns regarding these terms or the study itself, please contact the principal researcher:</p>
                                <p className=""><span className="font-semibold">Niklas Bognar</span></p>
                                <p className=""><span className="font-semibold">Email:</span> nb302289@falmouth.ac.uk</p>

                                <p className="">By proceeding with the study, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.</p>
                            </div>
                        </div>

                    </TabsContent>
                </Tabs>
            </div>
            <div className="flex justify-center mt-8" id="bottom">
                <Form action={acceptTerms}>
                    <StarButton as='button' className="font-azeretMono font-light text-foreground text-base" onClick={removeSurveyData}>
                        {t('agreeButton')}
                    </StarButton>
                </Form>
            </div>
        </div>
    );
};

export default TermsPage;