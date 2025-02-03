import '@/app/globals.css'
import Player from '@/components/Player'
export const metadata = {
  title: 'Music Recommendation Study',
  description: 'A study comparing different music recommendation models',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex flex-col justify-center justify-items-center pl-5">
        {children}
      </div>
      <Player />
    </>
  )
}