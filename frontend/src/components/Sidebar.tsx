"use client"
import { Home, Library, FileText, ClipboardListIcon } from 'lucide-react'
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dataset",
    url: "/songs",
    icon: Library,
    requiresAcceptance: true,
  },
  {
    title: "Survey",
    url: "/survey",
    icon: FileText,
    requiresAcceptance: true,
  },
  {
    title: "Results",
    url: "/results",
    icon: ClipboardListIcon,
    disabled: true,
    suffix: "released soon",
  },
]

export default function AppSidebar({ hasAcceptedTerms }: { hasAcceptedTerms: boolean }) {

  return (
    <Sidebar className='bg-background'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Music Recommendation Study</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.requiresAcceptance && !hasAcceptedTerms) return null;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild disabled={item.disabled}>
                      <Link href={item.url} aria-disabled={item.disabled}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                        {item.suffix && (
                          <span className="ml-2 text-sm font-medium text-gray-500">
                            {item.suffix}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
