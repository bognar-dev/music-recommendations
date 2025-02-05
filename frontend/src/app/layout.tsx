import '@/app/globals.css'
import Sidebar from '@/components/Sidebar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ModeToggle } from '@/components/ThemeToggle'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AudioProvider } from '@/context/audio-context'
import { SurveyContextProvider } from '@/context/survey-context'
import { Arimo } from 'next/font/google'
import { cookies } from 'next/headers'
const arimo = Arimo({ subsets: ['latin'] })

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
      <body className={`${arimo.className} bg-background`}>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SurveyContextProvider>
            <SidebarProvider>


              <Sidebar hasAcceptedTerms={hasAcceptedTerms} />
              <main className="flex flex-col flex-grow gap-1">
                <div className="flex justify-between justify-items-stretch p-2"> 
                  <SidebarTrigger />
                  <ModeToggle />
                </div>

                <AudioProvider>
                  <div className="flex flex-col justify-center justify-items-center">
                    {children}
                  </div>
                  

                </AudioProvider>
              </main>
            </SidebarProvider>
          </SurveyContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}