import { Search, Bell } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { ModeToggle } from './ThemeToggle'

export default function Header() {
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <div className="flex h-14 items-center px-6">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="What do you want to play?"
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Bell className="h-5 w-5" />
          <div className="h-8 w-8 rounded-full bg-primary" />
        </div>
      </div>
    </header>
  )
}

