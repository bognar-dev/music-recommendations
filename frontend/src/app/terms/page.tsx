"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Form from 'next/form';
import acceptTerms from '@/app/actions/acceptTerms';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-6">
            <div className="fixed bottom-4 right-4 md:hidden z-50">
                <Button 
                    variant="secondary" 
                    size="icon"
                    className="rounded-full shadow-lg"
                    onClick={scrollToBottom}
                >
                    <ChevronDown className="h-6 w-6" />
                </Button>
            </div>
            <Card className="w-full max-w-4xl shadow-lg shadow-accent bg-background/10">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
                        {t('title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-center text-muted-foreground mb-6">
                        {t('description')}
                    </p>
                    <Tabs defaultValue="tab1" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="tab1">{t('keyTerms')}</TabsTrigger>
                            <TabsTrigger value="tab2">{t('fullTerms')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="tab1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {terms.map((term, index) => (
                                    <Card key={index} className="bg-card/50 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold text-primary">
                                                {term.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">{term.content}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="tab2">
                            <Card className="bg-card/50 backdrop-blur-sm">
                                <CardContent className="prose prose-sm max-w-none">
                                    <h2>Full Terms and Conditions</h2>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies lacinia, nunc nisl tincidunt nunc, nec tincidunt nisl nunc nec nisl. Sed euismod, nunc nec tincidunt lacinia, nunc nisl tincidunt nunc, nec tincidunt nisl nunc nec nisl.</p>
                                    <h3>1. Acceptance of Terms</h3>
                                    <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                                    <h3>2. Description of Service</h3>
                                    <p>The website provides users with access to music recommendation algorithms as part of a research study.</p>
                                    {/* Add more sections as needed */}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                    <div className="flex justify-center mt-8" id="bottom">
                        <Form action={acceptTerms}>
                            <Button size="lg" className="text-lg text-foreground px-8 bg-background/10 hover:bg-background/90">
                                {t('agreeButton')}
                            </Button>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );  
};

export default TermsPage;