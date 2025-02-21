import { PostHog } from 'posthog-node'

const postHogServer = new PostHog(
    process.env.NEXT_PUBLIC_POSTHOG_KEY!,
    { host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com' }
)



export { postHogServer };