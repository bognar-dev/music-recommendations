
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react'; // Make sure to install lucide-react
import Form from 'next/form';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const TermsPage = async () => {
    const action = async () => {
        "use server";
        const cookieStore = await cookies()
        cookieStore.set('accepted-terms', 'true')
        redirect('/survey')
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-6 bg-background">
            <div className="fixed bottom-4 right-4 md:hidden">
                <Button 
                    variant="secondary" 
                    size="icon"
                    className="rounded-full shadow-lg"
                >
                    <ChevronDown className="h-6 w-6" />
                </Button>
            </div>

            <div className="bg-card shadow-lg rounded-lg p-6 md:p-8 max-w-3xl w-full text-card-foreground">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">Welcome to the Music Recommendation Study</h1>
                <p className="text-lg text-muted-foreground mb-6">
                    Please read and agree to the following terms before proceeding:
                </p>

                <div className="space-y-6 mb-8">
                    {/* Terms sections with improved styling */}
                    <section className="border border-border rounded-md p-4">
                        <h2 className="text-lg font-semibold text-primary mb-2">1. Purpose</h2>
                        <p className="text-muted-foreground">This website is designed to support research and provide insights into music recommendation systems.</p>
                    </section>

                    <section className="border border-border rounded-md p-4">
                        <h2 className="text-lg font-semibold text-primary mb-2">2. User Agreement</h2>
                        <p className="text-muted-foreground">By using this website, you agree to comply with these terms and conditions.</p>
                    </section>

                    <section className="border border-border rounded-md p-4">
                        <h2 className="text-lg font-semibold text-primary mb-2">3. Privacy and Data Collection</h2>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                            <li>I collect limited data for analytics and research purposes.</li>
                            <li>Your data will be handled securely and not shared with third parties without your consent.</li>
                            <li>Participation is entirely voluntary, and you can withdraw from the study at any time.</li>
                        </ul>
                    </section>

                    {/* Add similar sections for 4, 5, 6, and 7 */}
                </div>

                <div className="flex justify-center pt-6 border-t border-border">
                    <Form action={action}>
                        <Button size="lg" className="text-lg px-8">
                            I Agree, Show me the survey!
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
