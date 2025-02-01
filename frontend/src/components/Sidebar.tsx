"use client"
import { Home, Library, Plus, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({ hasAcceptedTerms }: { hasAcceptedTerms: boolean }) {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-60">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Music Study</h2>
          <div className="space-y-1">
            <Link href="/">
              <Button 
                variant={pathname === '/' ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            {hasAcceptedTerms && (
              <>
                <Link href="/songs">
                  <Button 
                    variant={pathname === '/songs' ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                  >
                    <Library className="mr-2 h-4 w-4" />
                    Dataset
                  </Button>
                </Link>
                <Link href="/survey">
                  <Button 
                    variant={pathname === '/survey' ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Survey
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="px-4 text-lg font-semibold">Playlists</h2>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
