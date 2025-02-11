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
import { useTranslations } from 'next-intl';

const items = [
  {
    title: "home",
    url: "/",
    icon: Home,
  },
  {
    title: "dataset",
    url: "/songs",
    icon: Library,
    requiresAcceptance: true,
  },
  {
    title: "survey",
    url: "/survey",
    icon: FileText,
    requiresAcceptance: true,
  },
  {
    title: "results",
    url: "/results",
    icon: ClipboardListIcon,
    disabled: true,
    suffix: "releasedSoon",
  },
]

export default function AppSidebar({ hasAcceptedTerms }: { hasAcceptedTerms: boolean }) {
  const t = useTranslations('AppSidebar');

  return (
    <Sidebar className='bg-background'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('musicRecommendationStudy')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (item.requiresAcceptance && !hasAcceptedTerms) return null;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild disabled={item.disabled}>
                      <Link href={item.url} aria-disabled={item.disabled}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{t(item.title)}</span>
                        {item.suffix && (
                          <span className="ml-2 text-sm font-medium text-gray-500">
                            {t(item.suffix)}
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