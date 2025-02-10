import '@/app/globals.css'
import Sidebar from '@/components/Sidebar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ModeToggle } from '@/components/ThemeToggle'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AudioProvider } from '@/context/audio-context'
import { SurveyContextProvider } from '@/context/survey-context'
import { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { cookies } from 'next/headers'
import { PostHogProvider } from './providers'
import { CookieBanner } from '@/components/cookie-banner'
import { getLocale, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl';
import LocaleSwitcher from '@/components/locale-switcher'
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "album covers",
    "music recommendations",
    "music",
    "recommendations",
    "recommendation",
    "music recommendation",
    "album cover recommendation",
    "album cover",
    "cover",
    "recommendations",
    "music recommendations",
    "Artificial Intelligence",
    "AI",
    "Machine Learning",
    "ML",
    "Deep Learning",
    "DL",
    "Computer Vision",
    "CV",
    "Computer Science",
    "CS",
    "Bachelors Degree",
    "BD",
    "Survey",
    "survey",
  ],
  authors: [
    {
      name: "Niklas Bognar",
      url: "https://bognar.co.uk",
    },
  ],
  creator: "niklasbognar",
  openGraph: {
    type: "website",
    locale: "en_UK",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@nonzeroexitcode",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hasAcceptedTerms = (await cookies()).get('accepted-terms')?.value === 'true'
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`font-notoSansSymbols bg-background`}>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <NextIntlClientProvider messages={messages}>
              <SurveyContextProvider>
                <SidebarProvider defaultOpen={false}>


                  <Sidebar hasAcceptedTerms={hasAcceptedTerms} />

                  <main className="flex flex-col flex-grow gap-1">

                    <div className="sticky bg-transparent backdrop-blur-sm top-0 flex justify-between justify-items-stretch p-2 ">
                      <SidebarTrigger />
                      <div className='flex gap-4'>
                        <LocaleSwitcher />
                        <ModeToggle />
                      </div>
                    </div>

                    <AudioProvider>
                      <div className="flex flex-col justify-center justify-items-center">
                        {children}
                      </div>


                    </AudioProvider>
                  </main>
                  <CookieBanner />
                </SidebarProvider>
              </SurveyContextProvider>
            </NextIntlClientProvider>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}