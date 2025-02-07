import { Disc3} from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function ThankYouPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-foreground">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-7xl font-extrabold mb-6 font-azeretMono">
                    You&apos;re a Rock Star!
                </h1>
                <p className="text-xl md:text-2xl mb-12">
                    Thank you for participating in our survey. Your feedback is music to my ears!
                </p>
                <div className="flex justify-center items-center mb-12 space-x-4">
                    {[...Array(5)].map((_, index) => (
                        <Disc3
                            key={index}
                            className={`w-16 h-16 md:w-24 md:h-24 animate-spin stroke-foreground stroke-1`}
                            style={{
                                animationDuration: `${3 + index * 0.5}s`,
                            }}
                        />
                    ))}
                </div>
                <p className="text-lg md:text-xl mb-8">
                    You&apos;ll be able to see the results in the results tab after April 1st.
                </p>
                
                <div className="space-y-4">
                <div className="space-x-4">
                    
                    <Button asChild className="text-foreground">
                        <Link href="/results">
                            Check Results
                        </Link>
                    </Button>
                    <Button asChild variant="secondary" className="text-foreground">
                        <Link href="/">
                            Back to Home
                        </Link>
                    </Button>
                </div>
                    <Button asChild variant="default" className="text-foreground">
                        <Link href="/">
                            Explore the Dataset that I used
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
