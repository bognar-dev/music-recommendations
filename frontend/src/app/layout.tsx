import './globals.css'
import { Inter } from 'next/font/google'
import Player from '@/components/Player'
import { ThemeProvider } from '@/components/ThemeProvider'

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
    <html lang="en">
      <body className={`${inter.className} bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            {children}
            <Player />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

