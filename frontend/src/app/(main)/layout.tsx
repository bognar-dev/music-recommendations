import '@/app/globals.css'
import { Inter } from 'next/font/google'
import Player from '@/components/Player'
import Sidebar from '@/components/Sidebar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AudioProvider } from '@/lib/audio-context'
import StepNavigation from '@/components/survey-step-navigation'
import Header from '@/components/Header'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Music Recommendation Study',
  description: 'A study comparing different music recommendation models',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header/>
          <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">

              <AudioProvider>
                <div className="flex flex-col justify-center justify-items-center">
                  <StepNavigation />
                  {children}
                </div>
                <Player />

              </AudioProvider>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}