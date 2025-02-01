import './globals.css'
import { Inter } from 'next/font/google'
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
        
           
                {children}
         
        </ThemeProvider>
      </body>
    </html>
  )
}