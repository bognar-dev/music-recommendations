import { Button } from '@/components/ui/button';

import Form from 'next/form';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const TermsPage = async () => {
    
    const action = async () => {
        "use server";
        const cookieStore = await cookies()
        cookieStore.set('accepted-terms', 'true')
        redirect('/survey')
    }
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-6">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-3xl w-full text-center">
                <h1 className="text-4xl font-bold mb-6">Welcome to the Music Recommendation Study</h1>
                <p className="text-lg leading-relaxed mb-4">
                    Please read and agree to the following terms before proceeding:
                </p>

                <div className="text-left space-y-6 mb-6">
                    <p><span className="font-bold">1. Purpose:</span> This website is designed to support research and provide insights into music recommendation systems.</p>
                    <p><span className="font-bold">2. User Agreement:</span> By using this website, you agree to comply with these terms and conditions.</p>
                    <span className="font-bold">3. Privacy and Data Collection:</span>
                        <ul className="list-disc pl-6">
                            <li>I collect limited data for analytics and research purposes.</li>
                            <li>Your data will be handled securely and not shared with third parties without your consent.</li>
                            <li>Participation is entirely voluntary, and you can withdraw from the study at any time without providing a reason.</li>
                        </ul>
                    <p><span className="font-bold">4. Content Usage:</span> All content on this site, including text, images, and code, is protected by copyright.</p>
                    <span className="font-bold">5. Withdrawal Rights:</span>
                        <ul className="list-disc pl-6">
                            <li>You can withdraw from the study at any time.</li>
                            <li>Contact me at nb302289@falmouth.ac.uk with your participant ID to have your data removed.</li>
                        </ul>
                    
                    <p><span className="font-bold">6. Disclaimer:</span> This website is provided for research purposes only. The information provided on this website is not intended for medical, legal, or financial advice. You should consult with a qualified healthcare professional before making any decisions based on the information provided.</p>
                    <p><span className="font-bold">7. Contact Me:</span> For any questions, concerns, or withdrawal requests, contact me at nb302289@falmouth.ac.uk.</p>
                </div>
                <Form action={action}>
                <Button>
                    <Link href='/survey'>
                        I Agree
                    </Link>
                </Button>

                </Form>
            </div>
        </div>
    );
};

export default TermsPage;
