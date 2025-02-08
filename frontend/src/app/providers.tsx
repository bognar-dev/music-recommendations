'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import PostHogPageView from './PostHogPageView'

if(process.env.NEXT_PUBLIC_POSTHOG_KEY) {
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'always',
    capture_pageview: false,
    capture_heatmaps: true,
    capture_pageleave: true,
  })
}
}else {
  console.log("No PostHog key provided");
}
export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return(
  <PostHogProvider client={posthog}>
    <PostHogPageView />
    {children}
  </PostHogProvider>
  )
}