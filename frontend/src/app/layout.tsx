import '@/app/globals.css'
import Header from '@/components/Header'
import Player from '@/components/Player'
import Sidebar from '@/components/Sidebar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AudioProvider } from '@/context/audio-context'
import { SurveyContextProvider } from '@/context/survey-context'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Music Recommendation Study',
  description: 'A study comparing different music recommendation models',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hasAcceptedTerms = (await cookies()).get('accepted-terms')?.value === 'true'
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SurveyContextProvider>
            <Header />
            <div className="min-h-screen flex">
              <Sidebar hasAcceptedTerms={hasAcceptedTerms} />
              <div className="flex-1 flex flex-col">

                <AudioProvider>
                  <div className="flex flex-col justify-center justify-items-center">
                    
                    {children}
                  </div>
                  <Player />

                </AudioProvider>
              </div>
            </div>
          </SurveyContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}